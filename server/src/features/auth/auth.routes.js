const express = require("express");

const router = express.Router();

const validateRequest = require("../../middlewares/validateRequest");

const {

signupSchema,

loginSchema,

verifyOtpSchema,

forgotPasswordSchema,

resendOtpSchema,

validateResetOtpSchema,

resetPasswordSchema,

} = require("./auth.validation");

const {
SignupController, verifyOtpController,verifyResetOtpController, resendOtpController,resetPasswordController, loginController, forgotPasswordController ,} = require("./auth.controller");

router.post(
    "/signup",
    validateRequest(signupSchema),
    SignupController
);

router.post(
    "/login",
    validateRequest(loginSchema),
    loginController
);

router.post(
    "/verify-otp",
    validateRequest(verifyOtpSchema),
    verifyOtpController
);

router.post(
    "/forgot-password",
    validateRequest(forgotPasswordSchema),
    forgotPasswordController
);

router.post(
    "/resend-otp",
    validateRequest(resendOtpSchema),
    resendOtpController
);

router.post(
    "/verify-reset-otp",
    validateRequest(validateResetOtpSchema),
    verifyResetOtpController
);

router.post(
    "/reset-password",
    validateRequest(resetPasswordSchema),
    resetPasswordController
);

module.exports = router