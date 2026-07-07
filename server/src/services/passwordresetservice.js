const {createOtp} = require("../services/otpservice")
const {findUserByEmail, updateUserByEmail} = require("../repositories/userrepositories")
const {sendEmail} = require("../services/emailservice")
const {hashPassword} = require("../utils/passwordhelper")

const forgotPasswordService = async (forgotData) => {
    const { email } = forgotData;
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Email is not registered");
    }
    const otpcombine = createOtp()
    const { otp, OtpExpiry } = otpcombine ;

    await updateUserByEmail(email, {
        otp: otp,
        otpExpire: OtpExpiry,
    });

    const emailSend = await sendEmail(email, otp);
    if (!emailSend) {
        throw new Error("Email sending failed to " + email);
    }

    return { email };
};

const resetPasswordService = async (resetData) => {
    const { email, otp, newPassword } = resetData;

    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Email is not registered");
    }

    if (user.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    if (new Date() > user.otpExpire) {
        throw new Error("OTP has expired");
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await updateUserByEmail(email, {
        password: hashedPassword,
        otp: null,
        otpExpire: null,
    });

    return updatedUser;
};
module.exports ={forgotPasswordService, forgotPasswordService, resetPasswordService}