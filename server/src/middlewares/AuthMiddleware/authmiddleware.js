const { success } = require("zod")
const { signupSchema, loginSchema, forgotPasswordSchema, verifyOtpSchema, resendOtpSchema, resetPasswordSchema } = require("../../validation/authvalidation")

const normalizeSignupBody = (body) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return body;
    }

    const normalizedBody = { ...body };

    if (normalizedBody.storename && !normalizedBody.storeName) {
        normalizedBody.storeName = normalizedBody.storename;
    }

    if (normalizedBody.storeName && !normalizedBody.storename) {
        normalizedBody.storename = normalizedBody.storeName;
    }

    return normalizedBody;
};

const ValidateSignup = async (req, res, next) => {
    try {
        const normalizedBody = normalizeSignupBody(req.body);
        const validateData = await signupSchema.safeParseAsync(normalizedBody)

        if (!validateData.success) {
            console.log(validateData.error.message)
            const collectError = validateData.error.issues.map((v) => {
                return { field: v.path[0], message: v.message }
            })
            return res.status(400).json({
                success: false,
                message: "Invalid Input",
                payload: null,
                errors: collectError
            })
        }

        req.sanitizedBody = validateData.data
        next()
    } catch (err) {
        console.error("Internal Server Error", err)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}

const validateVerifyOtp = async (req, res, next) => {
    try {
        const validateData = await verifyOtpSchema.safeParseAsync(req.body)
        if (!validateData.success) {
            const erros = validateData.error.issues.map((v) => {
                return { field: v.path[0], message: v.message }
            })
            console.log(erros);

            return res.status(400).json({
                success: false,
                message: "Invalid Inputs",
                error: erros
            })
        }
        req.sanitizedBody = validateData.data
        return next()
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal Server issue"
        })
    }
}

const validateResendOtp = async (req, res, next) => {
    try {
        const validateData = await resendOtpSchema.safeParseAsync(req.body);

        if (!validateData.success) {
            const errors = validateData.error.issues.map((v) => {
                return { field: v.path[0], message: v.message };
            });
            return res.status(400).json({
                success: false,
                message: "invalid inputs",
                error: errors,
            });
        }

        req.sanitizedBody = validateData.data;
        return next();
    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server issue",
            error: err.message
        });
    }
};

const validateLogin = async (req, res, next) => {
    try {
        const validatelogin = await loginSchema.safeParseAsync(req.body)
        if (!validatelogin.success) {
            const collectError = validateLogin.error.issues.map((v) => {
                return { path: v.path[0], message: v.message }
            })
            return res.status(400).json({
                success: false,
                message: "Invalid Input ",
                error: collectError
            })
        }

        req.sanitizedBody = validatelogin.data
        next()
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue"
        })
    }
}



const validateForgotPassword = async (req, res, next) => {
    try {
        const validateemail = await forgotPasswordSchema.safeParseAsync(req.body)
        if (!validateemail.success) {
            const Errors = validateemail.error.issues.map((v) => {
                return { path: v.path[0], message: v.message }
            })
            return res.status(400).json({
                success: false,
                message: "Invalid Email ",
                error: Errors
            })
        }

        req.sanitizedBody = validateemail.data
        next()

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue"
        })
    }
}


const validateResetPassword = async (req, res, next) => {
    try {
        const validateData = await resetPasswordSchema.safeParseAsync(req.body);
        if (!validateData.success) {
            const errors = validateData.error.issues.map((v) => ({ field: v.path[0], message: v.message }));
            return res.status(400).json({ success: false, message: "invalid inputs", error: errors });
        }
        req.sanitizedBody = validateData.data;
        return next();
    } catch (err) {
        return res.status(500).json({ success: false, message: "internal server issue" });
    }
};
module.exports = { ValidateSignup, validateLogin, validateVerifyOtp, validateResetPassword, validateResendOtp, validateForgotPassword }