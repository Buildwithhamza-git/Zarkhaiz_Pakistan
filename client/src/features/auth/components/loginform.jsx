import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import PasswordInput from "../../../shared/components/ui/PasswordInput";
import FormField from "../../../shared/components/ui/Formfield";

import { loginSchema } from "../validations/authValidation";
import useAuth from "../hooks/useAuth";
import useAuthContext from "../../../hooks/useAuth";

export default function LoginForm() {
    const navigate = useNavigate();

    // Backend API Login
    const { login: loginApi, loading } = useAuth();

    // Auth Context Login
    const { login } = useAuthContext();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            // Call Backend Login API
            const result = await loginApi(data);

            /*
                Expected Backend Response

                {
                    success: true,
                    token: "...",
                    user: {...}
                }

                OR

                {
                    success: true,
                    payload:{
                        token:"...",
                        user:{...}
                    }
                }
            */

            const token = result.payload?.token || result.token;
            const user = result.payload?.user || result.user;

            // Save User & Token in Context + LocalStorage
            login(user, token);

            // Redirect
            navigate("/dashboard");
        } catch (error) {
            const response = error.response?.data;

            if (response?.errors) {
                response.errors.forEach((err) => {
                    setError(err.field, {
                        type: "server",
                        message: err.message,
                    });
                });

                return;
            }

            setError("email", {
                type: "server",
                message: response?.message || "Login Failed",
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
                    placeholder="Enter your email"
                    {...register("email")}
                />
            </FormField>

            <FormField
                label="Password"
                required
                error={errors.password?.message}
            >
                <PasswordInput
                    placeholder="Enter your password"
                    {...register("password")}
                />
            </FormField>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-medium text-green-700 hover:underline"
                >
                    Forgot Password?
                </button>
            </div>

            <Button
                type="submit"
                className="w-full h-12"
                disabled={loading}
            >
                {loading ? "Logging In..." : "Login"}
            </Button>

            <div className="text-center text-gray-600">
                Don't have an account?

                <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="ml-2 font-semibold text-green-700 hover:underline"
                >
                    Register
                </button>
            </div>
        </form>
    );
}