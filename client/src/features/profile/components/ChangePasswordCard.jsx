import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, X } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../../shared/components/ui/button";
import PasswordInput from "../../../shared/components/ui/passwordinput";
import FormField from "../../../shared/components/ui/Formfield";

import { changePasswordSchema } from "../validations/profileValidation";
import useProfile from "../hooks/useProfile";

export default function ChangePasswordCard() {
    const [open, setOpen] = useState(false);
    const { changePassword, passwordLoading } = useProfile();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(changePasswordSchema),
    });

    const closeModal = () => {
        setOpen(false);
        reset();
    };

    const onSubmit = async (data) => {
        try {
            await changePassword(data);
            toast.success("Password changed successfully");
            closeModal();
        } catch (error) {
            if (error.errors) {
                error.errors.forEach((err) => {
                    setError(err.field, { type: "server", message: err.message });
                });
                return;
            }

            setError(error.field || "currentPassword", {
                type: "server",
                message: error.message,
            });
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex-1 min-w-[220px] flex items-start gap-3 rounded-xl border p-4 text-left hover:border-green-600 hover:bg-green-50 transition"
            >
                <Lock className="text-green-700 shrink-0" size={18} />
                <div>
                    <p className="font-semibold text-gray-900 text-sm">Change Password</p>
                    <p className="text-xs text-gray-500 mt-0.5">Update your account password</p>
                </div>
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
                        <button
                            type="button"
                            onClick={closeModal}
                            aria-label="Close"
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">Change Password</h3>
                        <p className="text-sm text-gray-500 mb-5">
                            Enter your current password and choose a new one.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                label="Current Password"
                                required
                                error={errors.currentPassword?.message}
                            >
                                <PasswordInput
                                    autoComplete="current-password"
                                    {...register("currentPassword")}
                                />
                            </FormField>

                            <FormField
                                label="New Password"
                                required
                                error={errors.newPassword?.message}
                            >
                                <PasswordInput
                                    autoComplete="new-password"
                                    {...register("newPassword")}
                                />
                            </FormField>

                            <FormField
                                label="Confirm New Password"
                                required
                                error={errors.confirmNewPassword?.message}
                            >
                                <PasswordInput
                                    autoComplete="new-password"
                                    {...register("confirmNewPassword")}
                                />
                            </FormField>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    fullWidth
                                    onClick={closeModal}
                                    disabled={passwordLoading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" fullWidth loading={passwordLoading}>
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
