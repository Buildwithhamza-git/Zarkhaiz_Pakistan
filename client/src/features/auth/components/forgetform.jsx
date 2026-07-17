import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/button";
import Input from "../../../shared/components/ui/input";
import FormField from "../../../shared/components/ui/Formfield";

import useAuth from "../hooks/useAuth";
import { forgotPasswordSchema } from "../validations/authValidation";

export default function ForgotPasswordForm() {
    const navigate = useNavigate();

    const {
        forgotPassword,
        forgotLoading,
    } = useAuth();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data) => {
        try {
            await forgotPassword(data);

            navigate("/verify-reset-otp", {
                state: {
                    email: data.email,
                },
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

            setError("email", {
                type: "server",
                message:
                    error?.message || "Something went wrong",
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <FormField
                label="Email Address"
                required
                error={errors.email?.message}
            >
                <Input
                    type="email"
                    placeholder="Enter your registered email"
                    {...register("email")}
                />
            </FormField>

            <Button
                type="submit"
                className="w-full h-12"
                disabled={forgotLoading}
            >
                {forgotLoading ? "Sending OTP..." : "Send OTP"}
            </Button>

            <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                    w-full
                    text-center
                    text-green-700
                    font-medium
                    hover:underline
                "
            >
                Back to Login
            </button>
        </form>
    );
}