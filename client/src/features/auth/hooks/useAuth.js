import { useState } from "react";

import {
    signupService,
    verifyOtpService,
    resendOtpService,
    loginService,
    forgotPasswordService,
    verifyResetOtpService,
    resetPasswordService,
} from "../services/authService";

export default function useAuth() {
    const [signupLoading, setSignupLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [verifyResetLoading, setVerifyResetLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const signup = async (data) => {
        setSignupLoading(true);
        try {
            return await signupService(data);
        } finally {
            setSignupLoading(false);
        }
    };

    const verifyOtp = async (data) => {
        setVerifyLoading(true);
        try {
            return await verifyOtpService(data);
        } finally {
            setVerifyLoading(false);
        }
    };

    const resendOtp = async (data) => {
        setResendLoading(true);
        try {
            return await resendOtpService(data);
        } finally {
            setResendLoading(false);
        }
    };

    const login = async (data) => {
        setLoginLoading(true);
        try {
            return await loginService(data);
        } finally {
            setLoginLoading(false);
        }
    };

    const forgotPassword = async (data) => {
        setForgotLoading(true);
        try {
            return await forgotPasswordService(data);
        } finally {
            setForgotLoading(false);
        }
    };

    const verifyResetOtp = async (data) => {
        setVerifyResetLoading(true);
        try {
            return await verifyResetOtpService(data);
        } finally {
            setVerifyResetLoading(false);
        }
    };

    const resetPassword = async (data) => {
        setResetLoading(true);
        try {
            return await resetPasswordService(data);
        } finally {
            setResetLoading(false);
        }
    };

    return {
        signup,
        verifyOtp,
        resendOtp,
        login,
        forgotPassword,
        verifyResetOtp,
        resetPassword,

        signupLoading,
        verifyLoading,
        resendLoading,
        loginLoading,
        forgotLoading,
        verifyResetLoading,
        resetLoading,
    };
}