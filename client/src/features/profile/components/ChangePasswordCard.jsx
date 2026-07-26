import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import Modal from "../../../shared/components/ui/Modal";
import { changePasswordApi } from "../api/profileApi";
import Toast from "../../../shared/components/ui/Toast";

export default function ChangePasswordCard() {
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({}); // 🔥 FIELD ERRORS

    const [show, setShow] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        // clear error on typing
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    // 🔥 BETTER VALIDATION (MULTIPLE ERRORS)
    const validate = () => {
        let newErrors = {};

        if (!form.currentPassword) {
            newErrors.currentPassword = "Current password required";
        }

        if (!form.newPassword) {
            newErrors.newPassword = "New password required";
        } else {
            if (form.newPassword.length < 8) {
                newErrors.newPassword = "Minimum 8 characters";
            } else if (!/[A-Z]/.test(form.newPassword)) {
                newErrors.newPassword = "Add at least one uppercase";
            } else if (!/[0-9]/.test(form.newPassword)) {
                newErrors.newPassword = "Add at least one number";
            } else if (!/[!@#$%^&*]/.test(form.newPassword)) {
                newErrors.newPassword = "Add at least one symbol";
            }
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Confirm password required";
        } else if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const res = await changePasswordApi(form);

            showToast(res?.message || "Password updated successfully");

            setOpen(false);
            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (err) {
            console.log("BACKEND ERROR:", err.response?.data);

            // 🔥 MAP BACKEND ERRORS
            const backendErrors = err?.response?.data?.errors;

            if (backendErrors && Array.isArray(backendErrors)) {
                let mapped = {};
                backendErrors.forEach((e) => {
                    mapped[e.field] = e.message;
                });
                setErrors(mapped);
            } else {
                showToast(err?.response?.data?.message || "Something went wrong", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* CARD */}
            <div
                onClick={() => setOpen(true)}
                className="cursor-pointer rounded-2xl border border-green-200 bg-green-50 p-5"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-green-100">
                        <Lock className="text-green-700" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-green-700">
                            Change Password
                        </h3>
                        <p className="text-sm text-green-600">
                            Secure your account
                        </p>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <Modal
                isOpen={open}
                onClose={() => !loading && setOpen(false)}
                title="Change Password"
            >
                <div className="space-y-4">

                    {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                        <div key={field}>
                            <div className="relative">
                                <input
                                    type={show[field] ? "text" : "password"}
                                    name={field}
                                    placeholder={field}
                                    value={form[field]}
                                    onChange={handleChange}
                                    className={`w-full border p-3 rounded-lg pr-10 ${
                                        errors[field] ? "border-red-500" : ""
                                    }`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShow((prev) => ({
                                            ...prev,
                                            [field]: !prev[field],
                                        }))
                                    }
                                    className="absolute right-3 top-3"
                                >
                                    {show[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* 🔥 ERROR MESSAGE */}
                            {errors[field] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors[field]}
                                </p>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </Modal>

            <Toast
                message={toast.message}
                show={toast.show}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
        </>
    );
}