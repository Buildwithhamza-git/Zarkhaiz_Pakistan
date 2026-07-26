import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../../../shared/components/ui/button";
import FormField from "../../../shared/components/ui/Formfield";
import useAuth from "../hooks/useAuth";

const otpSchema = z.object({
    otp: z
        .string({ required_error: "OTP is required" })
        .trim()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^[0-9]+$/, "OTP must contain only digits"),
});

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 120;

export default function VerifyOtpForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyOtp, resendOtp, loading } = useAuth();
    const [notice, setNotice] = useState("");
    const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const otpInputsRef = useRef([]);
    const [isResending, setIsResending] = useState(false);

    const email = location.state?.email || "";

    useEffect(() => {
        if (!email) {
            navigate("/signup", { replace: true });
        }
    }, [email, navigate]);

    useEffect(() => {
        if (resendCooldown <= 0) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [resendCooldown]);

    const {
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    });

    const formattedTimer = useMemo(() => {
        const minutes = Math.floor(resendCooldown / 60)
            .toString()
            .padStart(2, "0");
        const seconds = (resendCooldown % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    }, [resendCooldown]);

    const syncOtpValue = (digits) => {
        const joinedOtp = digits.join("");
        setValue("otp", joinedOtp, {
            shouldValidate: true,
            shouldDirty: true,
        });
        return joinedOtp;
    };

    const handleOtpDigitChange = (index, value) => {
        const nextValue = value.replace(/\D/g, "").slice(0, 1);
        const nextDigits = [...otpDigits];
        nextDigits[index] = nextValue;

        setOtpDigits(nextDigits);
        syncOtpValue(nextDigits);

        if (nextValue && index < OTP_LENGTH - 1) {
            otpInputsRef.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, event) => {
        if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
            event.preventDefault();
            const nextDigits = [...otpDigits];
            nextDigits[index - 1] = "";
            setOtpDigits(nextDigits);
            syncOtpValue(nextDigits);
            otpInputsRef.current[index - 1]?.focus();
        } else if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            otpInputsRef.current[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            event.preventDefault();
            otpInputsRef.current[index + 1]?.focus();
        }
    };

    const handleOtpPaste = (event) => {
        event.preventDefault();
        const pastedValue = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        const nextDigits = [...otpDigits];

        for (let index = 0; index < OTP_LENGTH; index += 1) {
            nextDigits[index] = pastedValue[index] || "";
        }

        setOtpDigits(nextDigits);
        syncOtpValue(nextDigits);

        const nextIndex = Math.min(pastedValue.length, OTP_LENGTH - 1);
        otpInputsRef.current[nextIndex]?.focus();
    };

    const onSubmit = async (data) => {
        clearErrors();
        setNotice("");

        const joinedOtp = otpDigits.join("");
        if (joinedOtp.length !== OTP_LENGTH) {
            setError("otp", {
                type: "server",
                message: "OTP must be exactly 6 digits",
            });
            return;
        }

        try {
            const result = await verifyOtp({
                email,
                otp: joinedOtp,
            });

            setIsRedirecting(true);
            setNotice(result?.message || "Account verified successfully.");

            window.setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1200);
        } catch (error) {
            const message = error?.message || "Verification failed. Please try again.";
            const field = error?.field || "otp";

            setError(field, {
                type: "server",
                message,
            });
        }
    };

    const handleResend = async () => {
        clearErrors();
        setNotice("");

        if (!email) {
            setError("otp", {
                type: "server",
                message: "Email is missing. Please sign up again.",
            });
            return;
        }

        setIsResending(true);

        try {
            await resendOtp({ email });

            setResendCooldown(RESEND_COOLDOWN_SECONDS);

            setOtpDigits(Array(OTP_LENGTH).fill(""));

            setValue("otp", "", {
                shouldValidate: true,
                shouldDirty: true,
            });

            setNotice("A fresh verification code has been sent to your email.");
        } catch (error) {
            const message =
                error?.message || "Unable to resend code. Please try again.";

            setError("otp", {
                type: "server",
                message,
            });
        } finally {
            setIsResending(false);
        }
    
};

return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-2xl border border-green-100 bg-green-50/80 p-4 text-sm text-gray-700">
            <p className="font-semibold text-green-800">Verify your email</p>
            <p className="mt-1">
                We sent a 6-digit code to <span className="font-semibold text-green-700">{email || "your email"}</span>.
            </p>
        </div>

        <FormField label="Verification Code" required error={errors.otp?.message}>
            <div className="flex gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, index) => (
                    <input
                        key={index}
                        ref={(element) => {
                            otpInputsRef.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(event) => handleOtpDigitChange(index, event.target.value)}
                        onKeyDown={(event) => handleOtpKeyDown(index, event)}
                        className={`h-12 w-11 rounded-xl border text-center text-lg font-semibold outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200 sm:h-14 sm:w-12 ${errors.otp?.message
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                        aria-label={`OTP digit ${index + 1}`}
                    />
                ))}
            </div>
        </FormField>

        {notice && <p className="text-sm font-medium text-green-700">{notice}</p>}

        <Button type="submit" fullWidth loading={loading || isRedirecting}>
            {isRedirecting ? "Redirecting to login..." : "Verify OTP"}
        </Button>

        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <button
                type="button"
                className={`font-semibold transition ${resendCooldown > 0 || isResending
                        ? "cursor-not-allowed text-gray-400"
                        : "text-green-700 hover:text-green-800"
                    }`}
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
            >
                {isResending
                    ? "Sending..."
                    : resendCooldown > 0
                        ? `Resend code in ${formattedTimer}`
                        : "Resend code"}
            </button>

            <button
                type="button"
                className="font-semibold text-gray-600 transition hover:text-gray-800"
                onClick={() => navigate("/signup")}
            >
                Back to signup
            </button>
        </div>
    </form>
);
}
