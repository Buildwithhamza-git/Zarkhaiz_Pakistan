import { useState } from "react";

import {
    signupService,
    verifyOtpService,
    resendOtpService,
    loginService,
    forgotPasswordService,
    resetPasswordService,
} from "../services/authService";

export default function useAuth() {
    const [loading, setLoading] = useState(false);

    const signup = async (data) => {
    setLoading(true);

    try {
        const response = await signupService(data);

        return response; 
    } finally {
        setLoading(false);
    }
};

    const verifyOtp = async (data) => {
        setLoading(true);

        try {
            return await verifyOtpService(data);
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async (data) => {
        setLoading(true);

        try {
            return await resendOtpService(data);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data) => {
        setLoading(true);

        try {
            return await loginService(data);
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (data) => {
        setLoading(true);

        try {
            return await forgotPasswordService(data);
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (data) => {
        setLoading(true);

        try {
            return await resetPasswordService(data);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        signup,
        verifyOtp,
        resendOtp,
        login,
        forgotPassword,
        resetPassword,
    };
}