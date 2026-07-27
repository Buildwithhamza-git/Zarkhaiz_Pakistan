import { useState } from "react";

import {
    getProfileService,
    updateProfileService,
    changePasswordService,
    deleteAccountService,
} from "../services/profileService";

export default function useProfile() {
    const [fetchLoading, setFetchLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // ======================================
    // Toast
    // ======================================

    const [toast, setToast] = useState({
        show: false,
        message: "",
    });

    const showToast = (message) => {
        setToast({
            show: true,
            message,
        });
    };

    const hideToast = () => {
        setToast({
            show: false,
            message: "",
        });
    };

    // ======================================
    // Fetch Profile
    // ======================================

    const fetchProfile = async () => {
        setFetchLoading(true);

        try {
            return await getProfileService();
        } finally {
            setFetchLoading(false);
        }
    };

    // ======================================
    // Save Profile
    // ======================================

   const saveProfile = async (data, setError) => {
    setSaveLoading(true);

    try {
        const response = await updateProfileService(data);

        showToast("Profile updated successfully ✅");

        return response;
    } catch (err) {
        console.error("SAVE PROFILE ERROR:", err);

        // ==========================================
        // Get backend response
        // ==========================================

        const responseData =
            err?.response?.data ||
            err?.data ||
            {};

        console.log(
            "Backend validation response:",
            responseData
        );

        // ==========================================
        // Find errors array
        // ==========================================

        const fieldErrors =
            responseData?.errors ||
            responseData?.data?.errors ||
            responseData?.data?.data?.errors ||
            [];

        // ==========================================
        // Handle field validation errors
        // ==========================================

        if (
            Array.isArray(fieldErrors) &&
            fieldErrors.length > 0 &&
            typeof setError === "function"
        ) {
            fieldErrors.forEach((fieldError) => {
                if (
                    fieldError?.field &&
                    fieldError?.message
                ) {
                    console.log(
                        "Setting form error:",
                        fieldError.field,
                        fieldError.message
                    );

                    setError(fieldError.field, {
                        type: "server",
                        message: fieldError.message,
                    });
                }
            });

            // IMPORTANT:
            // Don't show "Something went wrong"
            // toast for field validation errors.
            return null;
        }

        // ==========================================
        // Single field error fallback
        // ==========================================

        if (
            responseData?.field &&
            responseData?.message &&
            typeof setError === "function"
        ) {
            setError(responseData.field, {
                type: "server",
                message: responseData.message,
            });

            return null;
        }

        // ==========================================
        // General backend error
        // ==========================================

        const message =
            responseData?.message ||
            err?.message ||
            "Something went wrong ❌";

        showToast(message);

        throw err;
    } finally {
        setSaveLoading(false);
    }
};
    // ======================================
    // Change Password
    // ======================================

    const changePassword = async (data) => {
        setPasswordLoading(true);

        try {
            const response =
                await changePasswordService(data);

            showToast(
                "Password updated successfully 🔒"
            );

            return response;
        } catch (error) {
            showToast(
                error?.message ||
                    "Failed to change password"
            );

            throw error;
        } finally {
            setPasswordLoading(false);
        }
    };

    // ======================================
    // Delete Account
    // ======================================

    const deleteAccount = async (data) => {
        setDeleteLoading(true);

        try {
            const response =
                await deleteAccountService(data);

            showToast(
                "Account deleted successfully"
            );

            return response;
        } catch (error) {
            showToast(
                error?.message ||
                    "Failed to delete account"
            );

            throw error;
        } finally {
            setDeleteLoading(false);
        }
    };

    // ======================================
    // Return
    // ======================================

    return {
        fetchProfile,
        saveProfile,
        changePassword,
        deleteAccount,

        fetchLoading,
        saveLoading,
        passwordLoading,
        deleteLoading,

        toast,
        hideToast,
    };
}