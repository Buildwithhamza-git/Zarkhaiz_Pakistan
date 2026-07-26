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

    // 🔥 Toast state
    const [toast, setToast] = useState({
        show: false,
        message: "",
    });

    const showToast = (message) => {
        setToast({ show: true, message });
    };

    const hideToast = () => {
        setToast({ show: false, message: "" });
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
    // Save Profile (🔥 FIXED)
    // ======================================

const saveProfile = async (data, setError) => {
    setSaveLoading(true);
    try {
        const res = await updateProfileService(data);

        showToast("Profile updated successfully ✅");
        return res;

    } catch (err) {

        console.log("SAVE PROFILE ERROR:", err);

        // ✅ Extract backend error correctly
        const backendError = err?.response?.data;

        if (backendError?.field && setError) {
            setError(backendError.field, {
                type: "server",
                message: backendError.message,
            });

            showToast(backendError.message);
        } else {
            showToast(backendError?.message || "Something went wrong ❌");
        }

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
            const res = await changePasswordService(data);

            showToast("Password updated successfully 🔒");

            return res;
        } catch (error) {
            showToast(error.message || "Failed to change password");
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
            const res = await deleteAccountService(data);

            showToast("Account deleted successfully");

            return res;
        } catch (error) {
            showToast(error.message || "Failed to delete account");
            throw error;
        } finally {
            setDeleteLoading(false);
        }
    };

    return {
        fetchProfile,
        saveProfile,
        changePassword,
        deleteAccount,

        fetchLoading,
        saveLoading,
        passwordLoading,
        deleteLoading,

        // 🔥 expose toast
        toast,
        hideToast,
    };
}