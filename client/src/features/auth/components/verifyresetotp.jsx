import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "../../../shared/components/ui/button";
import OTPInput from "../../../shared/components/ui/OTPinput";

import useAuth from "../hooks/useAuth";

export default function VerifyResetOtpForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const {
        verifyResetOtp,
        resendOtp,
        verifyResetLoading,
        resendLoading,
    } = useAuth();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

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
            setError("");

            await resendOtp({
                email,
            });

            setTimer(60);
            setCanResend(false);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to resend OTP"
            );
        }
    };

    const handleVerify = async () => {

        console.log("Verify button clicked");
        try {
            setError("");

            await verifyResetOtp({
                email,
                otp,
            });

            navigate("/reset-password", {
                state: {
                    email,
                },
            });
        } catch (error) {
            const response = error.response?.data;

            if (response?.errors) {
                const otpError = response.errors.find(
                    (err) => err.field === "otp"
                );

                if (otpError) {
                    setError(otpError.message);
                    return;
                }
            }

            setError(response?.message || "Invalid OTP");
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-green-800">
                    Verify OTP
                </h2>

                <p className="mt-2 text-gray-500">
                    Enter the 6-digit OTP sent to
                </p>

                <p className="font-semibold text-green-700">
                    {email}
                </p>
            </div>

            <OTPInput
                value={otp}
                onChange={setOtp}
            />

            {error && (
                <p className="text-center text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="text-center">
                {!canResend ? (
                    <p className="text-gray-600">
                        Resend OTP in{" "}
                        <span className="font-semibold text-green-700">
                            {String(Math.floor(timer / 60)).padStart(
                                2,
                                "0"
                            )}
                            :
                            {String(timer % 60).padStart(
                                2,
                                "0"
                            )}
                        </span>
                    </p>
                ) : (
                    <button
                        type="button"
                        disabled={resendLoading}
                        onClick={handleResendOTP}
                        className="font-semibold text-green-700 hover:underline disabled:opacity-50"
                    >
                        {resendLoading ? "Sending..." : "Resend OTP"}
                    </button>
                )}
            </div>

            <Button
                type="button"
                className="w-full h-12"
                onClick={handleVerify}
                disabled={verifyResetLoading || otp.length !== 6}
            >
                {verifyResetLoading ? "Verifying..." : "Verify OTP"}
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
        </div>
    );
}