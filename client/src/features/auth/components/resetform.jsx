import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import PasswordInput from "../../../shared/components/ui/PasswordInput";
import FormField from "../../../shared/components/ui/FormField";
import OTPInput from "../../../shared/components/ui/OTPinput";

import useAuth from "../hooks/useAuth";
import { resetPasswordSchema } from "../validations/authValidation";

export default function ResetPasswordForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    console.log("Location State:", location.state);
    console.log("Email:", email);

    const {
    resetPassword,
    resendOtp,
    loading,
} = useAuth();

    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(180);
    const [canResend, setCanResend] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
    if (timer <= 0) {
        setCanResend(true);
        return;
    }

    const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
}, [timer]);

const handleResendOTP = async () => {
    try {
        await resendOtp({
            email,
        });

        setTimer(180);
        setCanResend(false);

    } catch (error) {
        console.log(error);
    }
};
    const onSubmit = async (data) => {
        try {
            await resetPassword({
                email,
                otp,
                newPassword: data.password,
                confirmNewPassword: data.confirmPassword,
            });


            navigate("/login");
        } catch (error) {
            const response = error.response?.data;

            if (response?.errors) {
                response.errors.forEach((err) => {
                    if (err.field === "otp") {
                        setError("otp", {
                            type: "server",
                            message: err.message,
                        });
                    } else {
                        setError(err.field, {
                            type: "server",
                            message: err.message,
                        });
                    }
                });

                return;
            }

            setError("otp", {
                type: "server",
                message: response?.message || "Invalid OTP",
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="text-center">

                <h2 className="text-2xl font-bold text-green-800">
                    Reset Password
                </h2>

                <p className="mt-2 text-gray-500">
                    Enter the 6-digit OTP sent to your email
                </p>

            </div>

            <div>

                <OTPInput
                    value={otp}
                    onChange={setOtp}
                />

                {errors.otp && (
                    <p className="mt-2 text-center text-sm text-red-600">
                        {errors.otp.message}
                    </p>
                )}

            </div>
            <div className="text-center">

    {!canResend ? (

        <p className="text-gray-600">

            Resend OTP in{" "}

            <span className="font-semibold text-green-700">

                {String(Math.floor(timer / 60)).padStart(2, "0")}:

                {String(timer % 60).padStart(2, "0")}

            </span>

        </p>

    ) : (

        <button
            type="button"
            onClick={handleResendOTP}
            className="text-green-700 font-semibold hover:underline"
        >
            Resend OTP
        </button>

    )}

</div>

            <FormField
                label="New Password"
                required
                error={errors.password?.message}
            >
                <PasswordInput
                    placeholder="New Password"
                    {...register("password")}
                />
            </FormField>

            <FormField
                label="Confirm Password"
                required
                error={errors.confirmPassword?.message}
            >
                <PasswordInput
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                />
            </FormField>

            <Button
                type="submit"
                className="w-full h-12"
                disabled={loading}
            >
                {loading
                    ? "Resetting..."
                    : "Reset Password"}
            </Button>

            <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                    w-full
                    text-center
                    text-green-700
                    hover:underline
                "
            >
                Back to Login
            </button>

        </form>
    );
}