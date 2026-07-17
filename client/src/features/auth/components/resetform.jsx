import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/button";
import PasswordInput from "../../../shared/components/ui/passwordinput";
import FormField from "../../../shared/components/ui/Formfield";

import useAuth from "../hooks/useAuth";
import { resetPasswordSchema } from "../validations/authValidation";

export default function ResetPasswordForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const {
        resetPassword,
        resetLoading,
    } = useAuth();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password", { replace: true });
        }
    }, [email, navigate]);

    const onSubmit = async (data) => {
        try {
            await resetPassword({
                email,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            if (error?.errors) {
                error.errors.forEach((err) => {
                    setError(err.field, {
                        type: "server",
                        message: err.message,
                    });
                });

                return;
            }

            setError("password", {
                type: "server",
                message: error?.message || "Unable to reset password",
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
                    Create a new password for your account.
                </p>

                <p className="font-semibold text-green-700">
                    {email}
                </p>
            </div>

            <FormField
                label="New Password"
                required
                error={errors.password?.message}
            >
                <PasswordInput
                    placeholder="Enter New Password"
                    {...register("password")}
                />
            </FormField>

            <FormField
                label="Confirm Password"
                required
                error={errors.confirmPassword?.message}
            >
                <PasswordInput
                    placeholder="Confirm New Password"
                    {...register("confirmPassword")}
                />
            </FormField>

            <Button
                type="submit"
                className="w-full h-12"
                disabled={resetLoading}
            >
                {resetLoading
                    ? "Resetting Password..."
                    : "Reset Password"}
            </Button>

            <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full text-center text-green-700 hover:underline"
            >
                Back to Login
            </button>
        </form>
    );
}