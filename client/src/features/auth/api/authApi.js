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
        throw normalizeError(error);
    }
};

export const verifyOtpApi = async (data) => {
    try {
        const response = await api.post("/auth/verify-otp", data);
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};

export const resendOtpApi = async (data) => {
    try {
        const response = await api.post("/auth/resend-otp", data);
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};

export const loginApi = async (data) => {
    try {
        const response = await api.post("/auth/login", data);
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};

export const forgotPasswordApi = async (data) => {
    try {
        const response = await api.post("/auth/forgot-password", data);
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};

export const verifyResetOtpApi = async (data) => {
    try {
        const response = await api.post("/auth/verify-reset-otp", data);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};

export const resetPasswordApi = async (data) => {
    try {
        const response = await api.post("/auth/reset-password", data);
        return response.data;
    } catch (error) {
        throw normalizeError(error);
    }
};