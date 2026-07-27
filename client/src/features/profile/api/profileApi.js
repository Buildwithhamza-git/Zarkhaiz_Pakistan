import api from "../../../api/axios";

// ===============================
// GET PROFILE
// ===============================

export const getProfileApi = async () => {
    const response = await api.get("/profile");

    return response.data;
};


// ===============================
// UPDATE PROFILE
// ===============================

export const updateProfileApi = async (data) => {
    const response = await api.put(
        "/profile",
        data
    );

    return response.data;
};


// ===============================
// CHANGE PASSWORD
// ===============================

export const changePasswordApi = async (data) => {
    console.log("📡 API PAYLOAD:", data);

    const response = await api.put(
        "/profile/change-password",
        data
    );

    return response.data;
};


// ===============================
// DELETE ACCOUNT
// ===============================

export const deleteAccountApi = async (data) => {
    const response = await api.delete(
        "/profile/delete-account",
        {
            data,
        }
    );

    return response.data;
};