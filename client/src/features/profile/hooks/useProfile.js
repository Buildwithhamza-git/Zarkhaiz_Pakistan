import { useState } from "react";

import {
    getProfileService,
    updateProfileService,
    uploadAvatarService,
    changePasswordService,
    deleteAccountService,
} from "../services/profileService";

export default function useProfile() {
    const [fetchLoading, setFetchLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchProfile = async () => {
        setFetchLoading(true);
        try {
            return await getProfileService();
        } finally {
            setFetchLoading(false);
        }
    };

    const saveProfile = async (data) => {
        setSaveLoading(true);
        try {
            return await updateProfileService(data);
        } finally {
            setSaveLoading(false);
        }
    };

    const uploadAvatar = async (file) => {
        setAvatarLoading(true);
        try {
            return await uploadAvatarService(file);
        } finally {
            setAvatarLoading(false);
        }
    };

    const changePassword = async (data) => {
        setPasswordLoading(true);
        try {
            return await changePasswordService(data);
        } finally {
            setPasswordLoading(false);
        }
    };

    const deleteAccount = async (data) => {
        setDeleteLoading(true);
        try {
            return await deleteAccountService(data);
        } finally {
            setDeleteLoading(false);
        }
    };

    return {
        fetchProfile,
        saveProfile,
        uploadAvatar,
        changePassword,
        deleteAccount,

        fetchLoading,
        saveLoading,
        avatarLoading,
        passwordLoading,
        deleteLoading,
    };
}
