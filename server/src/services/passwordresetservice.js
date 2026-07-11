const {createOtp} = require("../services/otpservice")
const {findUserByEmail, updateUserByEmail} = require("../repositories/userrepositories")
const {sendResetPasswordEmail} = require("../services/emailservice")
const {hashPassword, comparePassword} = require("../utils/passwordhelper")
const {normalizeEmail} = require("../utils/emailhelper")

const forgotPasswordService = async (forgotData) => {
    const { email } = forgotData;
    const normalemail = normalizeEmail(email)
    const user = await findUserByEmail(normalemail);
    if (!user) {
        throw new Error("Email is not registered");
    }
    const otpcombine = createOtp()
    const { otp, OtpExpiry } = otpcombine ;

    await updateUserByEmail(normalemail, {
        otp: otp,
        otpExpire: OtpExpiry,
    });

    const emailSend = await sendResetPasswordEmail(normalemail, otp);
    if (!emailSend) {
        throw new Error("Email sending failed to " + normalemail);
    }

    return { normalemail };
};


const verifyResetOtpService = async (otpDetail) => {
    const { email, otp } = otpDetail;

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Email is not registered");
    }

    if (!user.otp || !user.otpExpire) {
        throw new Error("No OTP found. Please request a new OTP.");
    }

    if (new Date() > user.otpExpiry) {
        throw new Error("OTP has expired");
    }

    if (user.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    user.isResetOtpVerified = true;

    await user.save();
    return {
        success: true,
        message: "OTP verified successfully.",
    };
};


const resetPasswordService = async (resetData) => {
    const { email,  password } = resetData;
    console.log(password);

    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Email is not registered");
    }

     if (!user.isResetOtpVerified) {
        throw new Error("Please verify your OTP first.");
    }
    
    const isSamePassword = await comparePassword(password,user.password);
    if (isSamePassword) {
        throw new Error("New password cannot be the same as your previous password.");
    }

    const hashedPassword = await hashPassword(password);

    const updatedUser = await updateUserByEmail(email, {
        password: hashedPassword,
        otp: null,
        otpExpire: null,
        isResetOtpVerified: false
        
    });

    return updatedUser;
};

module.exports ={forgotPasswordService,resetPasswordService, verifyResetOtpService}