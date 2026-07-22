import {
    getProfileApi,
    updateProfileApi,
    uploadAvatarApi,
    changePasswordApi,
    deleteAccountApi,
} from "../api/profileApi";

export const getProfileService = async () => {
    return await getProfileApi();
};

export const updateProfileService = async (data) => {
    return await updateProfileApi(data);
};

export const uploadAvatarService = async (file) => {
    return await uploadAvatarApi(file);
};

export const changePasswordService = async (data) => {
    return await changePasswordApi(data);
};

export const deleteAccountService = async (data) => {
    return await deleteAccountApi(data);
};
