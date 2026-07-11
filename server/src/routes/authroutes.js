const express = require("express")
const routes = express.Router()
const {ValidateSignup, validateLogin, validateForgotPassword,validateResetPassword, validateVerifyOtp, validateResendOtp, validateresetotp}=require("../middlewares/AuthMiddleware/authmiddleware")
const {SignupController, loginController, forgotPasswordController, resetPasswordController,VerifyOtpController, resendOtpController, verifyResetOtpController} =require("../controllers/auth/authcontoller")


routes.post("/signup",ValidateSignup, SignupController )
routes.post("/verify-otp", validateVerifyOtp, VerifyOtpController)
routes.post("/resend-otp", validateResendOtp, resendOtpController)
routes.post("/verify-reset-otp", validateresetotp, verifyResetOtpController)
routes.post("/login",validateLogin,  loginController )
routes.post("/forgot-password", validateForgotPassword, forgotPasswordController);
routes.post("/reset-password", validateResetPassword, resetPasswordController);


module.exports= routes