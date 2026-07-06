import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import PasswordInput from "../../../shared/components/ui/PasswordInput";
import FormField from "../../../shared/components/ui/FormField";

import { signupSchema } from "../validations/authValidation";
import useAuth from "../hooks/useAuth";

export default function RegisterForm() {
    const navigate = useNavigate();

    const { signup, loading } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
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

    const role = watch("role");

    const onSubmit = async (data) => {
        try {
            clearErrors();

            if (data.role !== "seller") {
                delete data.storeName;
            }

            const result = await signup(data);
            navigate("/verify-otp", {
                state: {
                    email: result.email,
                    userId: result.userId,
                },
            });
        } catch (error) {
            const field = error?.field;
            const message = error?.message || "Signup failed. Please try again.";

            if (error?.errors) {
                error.errors.forEach((err) => {
                    setError(err.field, {
                        type: "server",
                        message: err.message,
                    });
                });
                setFocus(field || "email");
                return;
            }

            if (field) {
                setError(field, {
                    type: "server",
                    message,
                });
                setFocus(field);
                return;
            }

            setError("email", {
                type: "server",
                message,
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

            {/* Email & Role */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                    label="Email"
                    required
                    error={errors.email?.message}
                >
                    <Input
                        type="email"
                        placeholder="Email Address"
                        {...register("email")}
                    />
                </FormField>

                <FormField
                    label="Role"
                    required
                    error={errors.role?.message}
                >
                    <select
                        {...register("role")}
                        className="w-full h-12 rounded-xl border border-gray-300 px-4 bg-white outline-none focus:border-green-600 focus:ring-2 focus:ring-green-300"
                    >
                        <option value="farmer">Farmer</option>
                        <option value="seller">Seller</option>
                    </select>
                </FormField>
            </div>

            {/* Password & Confirm Password */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                    label="Password"
                    required
                    error={errors.password?.message}
                >
                    <PasswordInput
                        placeholder="Password"
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

            {/* Address */}

            <FormField
                label="Address"
                required
                error={errors.address?.message}
            >
                <textarea
                    rows={3}
                    placeholder="House No, Street, Area"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-green-300 focus:border-green-600"
                    {...register("address")}
                />
            </FormField>

            {/* City & Province */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                    label="City"
                    required
                    error={errors.city?.message}
                >
                    <Input
                        placeholder="City"
                        {...register("city")}
                    />
                </FormField>

                <FormField
                    label="Province"
                    required
                    error={errors.province?.message}
                >
                    <select
                        {...register("province")}
                        className="w-full h-12 rounded-xl border border-gray-300 px-4 bg-white outline-none focus:ring-2 focus:ring-green-300 focus:border-green-600"
                    >
                        <option value="">Select Province</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Khyber Pakhtunkhwa">
                            Khyber Pakhtunkhwa
                        </option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Gilgit-Baltistan">
                            Gilgit-Baltistan
                        </option>
                        <option value="Azad Jammu & Kashmir">
                            Azad Jammu & Kashmir
                        </option>
                        <option value="Islamabad Capital Territory">
                            Islamabad Capital Territory
                        </option>
                    </select>
                </FormField>
            </div>

            {/* Postal Code & Store Name */}

            {role === "seller" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                        label="Postal Code"
                        error={errors.postalCode?.message}
                    >
                        <Input
                            placeholder="38000"
                            {...register("postalCode")}
                        />
                    </FormField>

                    <FormField
                        label="Store Name"
                        required
                        error={errors.storeName?.message}
                    >
                        <Input
                            placeholder="Green Agri Store"
                            {...register("storeName")}
                        />
                    </FormField>
                </div>
            ) : (
                <FormField
                    label="Postal Code"
                    error={errors.postalCode?.message}
                >
                    <Input
                        placeholder="38000"
                        {...register("postalCode")}
                    />
                </FormField>
            )}

            <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold"
                disabled={loading}
            >
                {loading ? "Creating Account..." : "Create Account"}
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