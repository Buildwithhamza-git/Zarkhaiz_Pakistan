import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import Modal from "../../../shared/components/ui/Modal";
import { deleteAccountApi } from "../api/profileApi";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../../shared/components/ui/PasswordInput";
import Toast from "../../../shared/components/ui/Toast";

export default function DeleteAccountCard() {
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // ✅ Toast state
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const navigate = useNavigate();

    // ✅ Toast helper
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const handleDelete = async () => {
        setErrors({});

        // ✅ Validate confirm text
        if (confirmText !== "DELETE") {
            const msg = "Type DELETE to confirm.";
            setErrors({ confirmText: msg });
            showToast(msg, "error");
            return;
        }

        // ✅ Validate password
        if (!password) {
            const msg = "Password is required.";
            setErrors({ password: msg });
            showToast(msg, "error");
            return;
        }

        try {
            setLoading(true);

            // 🔥 Loading feedback
            showToast("Deleting your account...", "success");

            const res = await deleteAccountApi({ password });

            // ✅ Success
            showToast(
                res?.message || "Your account has been permanently deleted.",
                "success"
            );

            // cleanup
            localStorage.removeItem("token");

            setTimeout(() => {
    window.location.href = "/login"; // 🔥 FULL RESET
}, 800);

        } catch (err) {
            const backendErrors = err?.errors || [];

            if (backendErrors.length > 0) {
                const formatted = {};
                backendErrors.forEach((e) => {
                    formatted[e.field] = e.message;
                });
                setErrors(formatted);

                showToast(
                    backendErrors[0]?.message || "Error occurred",
                    "error"
                );
            } else {
                setErrors({
                    general: err?.message || "Something went wrong",
                });

                showToast(err?.message || "Something went wrong", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 🔥 Trigger Card */}
            <div
                onClick={() => setOpen(true)}
                className="group cursor-pointer rounded-2xl border border-red-200 bg-red-50 p-5 hover:shadow-md transition"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-red-100 group-hover:bg-red-200 transition">
                        <Trash2 className="text-red-600" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-red-700">
                            Delete Account
                        </h3>
                        <p className="text-sm text-red-500">
                            Permanently remove your account and all data
                        </p>
                    </div>
                </div>
            </div>

            {/* 🔥 Modal */}
            <Modal
                isOpen={open}
                onClose={() => !loading && setOpen(false)}
                title="Delete Account"
            >
                <div className="space-y-5">

                    {/* Warning */}
                    <div className="flex gap-3 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        <AlertTriangle size={18} />
                        <p>This action is permanent and cannot be undone.</p>
                    </div>

                    {/* Password */}
                    <PasswordInput
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />

                    {/* Confirm DELETE */}
                    <div>
                        <input
                            type="text"
                            placeholder='Type "DELETE" to confirm'
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className={`w-full border p-3 rounded-lg outline-none ${
                                errors.confirmText
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.confirmText && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmText}
                            </p>
                        )}
                    </div>

                    {/* General Error */}
                    {errors.general && (
                        <p className="text-red-500 text-sm text-center">
                            {errors.general}
                        </p>
                    )}

                    {/* Button */}
                    <button
                        onClick={handleDelete}
                        disabled={
                            loading ||
                            confirmText !== "DELETE" ||
                            !password
                        }
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete Account"}
                    </button>
                </div>
            </Modal>

            {/* ✅ Toast Renderer */}
            <Toast
                message={toast.message}
                show={toast.show}
                onClose={() =>
                    setToast((prev) => ({ ...prev, show: false }))
                }
            />
        </>
    );
}