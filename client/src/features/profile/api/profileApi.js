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
    try {
        const response = await api.put("/profile", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


// ===============================
// CHANGE PASSWORD
// ===============================
export const changePasswordApi = async (data) => {
    try {
          console.log("📡 API PAYLOAD:", data);
        const response = await api.put("/profile/change-password", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


// ===============================
// DELETE ACCOUNT
// ===============================
export const deleteAccountApi = async (data) => {
    try {
        const response = await api.delete("/profile/delete-account", {
            data,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};