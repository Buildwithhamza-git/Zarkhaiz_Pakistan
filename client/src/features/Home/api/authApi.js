import api from "../../../api/axios";

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

export const signupApi = async (data) => {
    try {
        const response = await api.post("/auth/signup", data);
        return response.data;
    } catch (error) {
        const normalizedError = normalizeError(error);
        throw normalizedError;
    }
};

export const verifyOtpApi = async (data) => {
    try {
        const response = await api.post("/auth/verify-otp", data);
        return response.data;
    } catch (error) {
        const normalizedError = normalizeError(error);
        throw normalizedError;
    }
};

export const resendOtpApi = async (data) => {
    try {
        const response = await api.post("/auth/resend-otp", data);
        return response.data;
    } catch (error) {
        const normalizedError = normalizeError(error);
        throw normalizedError;
    }
};

export const loginApi = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const forgotPasswordApi = async (data) => {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
};

export const resetPasswordApi = async (data) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
};