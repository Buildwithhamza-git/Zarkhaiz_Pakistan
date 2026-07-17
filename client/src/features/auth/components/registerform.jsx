import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/button";
import Input from "../../../shared/components/ui/input";
import PasswordInput from "../../../shared/components/ui/passwordinput";
import FormField from "../../../shared/components/ui/Formfield";

import { signupSchema } from "../validations/authValidation";
import useAuth from "../hooks/useAuth";

export default function RegisterForm() {
    const navigate = useNavigate();

    const {
        signup,
        signupLoading,
    } = useAuth();

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        setFocus,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: "farmer",
            postalCode: "",
            storeName: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            clearErrors();

            const payload = { ...data };

            if (payload.role !== "seller") {
                delete payload.storeName;
            }

            const result = await signup(payload);

            navigate("/verify-otp", {
                replace: true,
                state: {
                    email: result.email ?? payload.email,
                    userId: result.userId,
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

                if (error.field) {
                    setFocus(error.field);
                }

                return;
            }

            if (error?.field) {
                setError(error.field, {
                    type: "server",
                    message: error.message,
                });

                setFocus(error.field);
                return;
            }

            setError("email", {
                type: "server",
                message:
                    error?.message ||
                    "Signup failed. Please try again.",
            });

            setFocus("email");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            {/* First Name & Last Name */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                    label="First Name"
                    required
                    error={errors.firstname?.message}
                >
                    <Input
                        placeholder="First Name"
                        {...register("firstname")}
                    />
                </FormField>

                <FormField
                    label="Last Name"
                    required
                    error={errors.lastname?.message}
                >
                    <Input
                        placeholder="Last Name"
                        {...register("lastname")}
                    />
                </FormField>
            </div>

            {/* Username & Phone */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                    label="Username"
                    required
                    error={errors.username?.message}
                >
                    <Input
                        placeholder="Username"
                        {...register("username")}
                    />
                </FormField>

                <FormField
                    label="Phone Number"
                    required
                    error={errors.phone?.message}
                >
                    <Input
                        placeholder="03XXXXXXXXX"
                        {...register("phone")}
                    />
                </FormField>
            </div>

            {/* Email */}

            <FormField
                label="Email Address"
                required
                error={errors.email?.message}
            >
                <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                />
            </FormField>

            {/* Password */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                    label="Password"
                    required
                    error={errors.password?.message}
                >
                    <PasswordInput
                        placeholder="Enter Password"
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
            </div>

            <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold"
                disabled={signupLoading}
            >
                {signupLoading
                    ? "Creating Account..."
                    : "Create Account"}
            </Button>

            <p className="text-center text-gray-600">
                Already have an account?

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="ml-2 font-semibold text-green-700 hover:underline"
                >
                    Login
                </button>
            </p>
        </form>
    );
}