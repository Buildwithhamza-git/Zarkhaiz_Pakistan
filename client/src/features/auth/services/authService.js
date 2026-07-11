import {
    signupApi,
    verifyOtpApi,
    resendOtpApi,
    loginApi,
    forgotPasswordApi,
    verifyResetOtpApi,
    resetPasswordApi,
} from "../api/authApi";

export const signupService = async (data) => {
    return await signupApi(data);
};

export const verifyOtpService = async (data) => {
    return await verifyOtpApi(data);
};

export const resendOtpService = async (data) => {
    return await resendOtpApi(data);
};

export const loginService = async (data) => {
    return await loginApi(data);
};

export const forgotPasswordService = async (data) => {
    return await forgotPasswordApi(data);
};

export const verifyResetOtpService = async (data) => {
    return await verifyResetOtpApi(data);
};

export const resetPasswordService = async (data) => {
    return await resetPasswordApi(data);
};