import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Trash2, X, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../../shared/components/ui/button";
import PasswordInput from "../../../shared/components/ui/passwordinput";
import Input from "../../../shared/components/ui/input";
import FormField from "../../../shared/components/ui/Formfield";

import { deleteAccountSchema } from "../validations/profileValidation";
import useProfile from "../hooks/useProfile";
import useAuthContext from "../../../hooks/useAuth";

export default function DeleteAccountCard() {
    const [open, setOpen] = useState(false);
    const { deleteAccount, deleteLoading } = useProfile();
    const { logout } = useAuthContext();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(deleteAccountSchema),
        defaultValues: { password: "", confirmText: "" },
    });

    const closeModal = () => {
        setOpen(false);
        reset();
    };

    const onSubmit = async ({ password }) => {
        try {
            await deleteAccount({ password });
            toast.success("Your account has been deleted");
            logout();
            navigate("/");
        } catch (error) {
            if (error.errors) {
                error.errors.forEach((err) => {
                    setError(err.field, { type: "server", message: err.message });
                });
                return;
            }

            setError(error.field || "password", {
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
                className="flex-1 min-w-[220px] flex items-start gap-3 rounded-xl border border-red-200 p-4 text-left hover:border-red-500 hover:bg-red-50 transition"
            >
                <Trash2 className="text-red-600 shrink-0" size={18} />
                <div>
                    <p className="font-semibold text-red-600 text-sm">Delete Account</p>
                    <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account</p>
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

                        <div className="flex items-center gap-3 mb-1">
                            <span className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                <AlertTriangle size={18} />
                            </span>
                            <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
                        </div>

                        <p className="text-sm text-gray-500 mb-5">
                            This action is permanent and cannot be undone. All your data will be
                            removed.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                label="Enter your password"
                                required
                                error={errors.password?.message}
                            >
                                <PasswordInput
                                    autoComplete="current-password"
                                    {...register("password")}
                                />
                            </FormField>

                            <FormField
                                label='Type "DELETE" to confirm'
                                required
                                error={errors.confirmText?.message}
                            >
                                <Input placeholder="DELETE" {...register("confirmText")} />
                            </FormField>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    fullWidth
                                    onClick={closeModal}
                                    disabled={deleteLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="danger"
                                    fullWidth
                                    loading={deleteLoading}
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
