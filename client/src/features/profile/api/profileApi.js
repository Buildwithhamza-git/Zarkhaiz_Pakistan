import api from "../../../api/axios";
import { getToken } from "../../../utlis/storage";

const normalizeError = (error) => {
    const serverData = error?.response?.data ?? error?.data ?? error;

    if (serverData && typeof serverData === "object") {
        return {
            message: serverData.message || "Request failed",
            field: serverData.field || null,
            errors: serverData.errors || serverData.error || null,
            status: error?.response?.status || null,
            data: serverData,
        };
    }

    return {
        message: error?.message || "Request failed",
        field: null,
        errors: null,
        status: null,
        data: null,
    };
};

// Every request in this feature needs the logged-in user's token.
const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
});

export const getProfileApi = async () => {
    try {
        const response = await api.get("/users/me", {
            headers: authHeaders(),
        });
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};

export const updateProfileApi = async (data) => {
    try {
        const response = await api.patch("/users/me", data, {
            headers: authHeaders(),
        });
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};

export const uploadAvatarApi = async (file) => {
    try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await api.post("/users/me/avatar", formData, {
            headers: authHeaders(),
        });
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};

export const changePasswordApi = async (data) => {
    try {
        const response = await api.patch("/users/me/password", data, {
            headers: authHeaders(),
        });
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};

export const deleteAccountApi = async (data) => {
    try {
        const response = await api.delete("/users/me", {
            data,
            headers: authHeaders(),
        });
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};
