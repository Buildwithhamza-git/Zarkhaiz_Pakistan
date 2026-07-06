import api from "../../../api/axios";

const normalizeError = (error) => {
    const serverData = error?.response?.data ?? error?.data ?? error;

    if (serverData && typeof serverData === "object") {
        return {
            message: serverData.message || "Request failed",
            field: serverData.field || null,
            errors: serverData.errors || null,
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

export const signupApi = async (data) => {
    try {
        const response = await api.post("/signup", data);
        return response.data;
    } catch (error) {
        const normalizedError = normalizeError(error);
        throw normalizedError;
    }
};

export const verifyOtpApi = async (data) => {
    const response = await api.post("/verify-otp", data);
    return response.data;
};

export const resendOtpApi = async (data) => {
    const response = await api.post("/resend-otp", data);
    return response.data;
};

export const loginApi = async (data) => {
    const response = await api.post("/login", data);
    return response.data;
};

export const forgotPasswordApi = async (data) => {
    const response = await api.post("/forgot-password", data);
    return response.data;
};

export const resetPasswordApi = async (data) => {
    const response = await api.post("/reset-password", data);
    return response.data;
};