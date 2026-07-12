const {
    generateOtp,
    otpExpiry,
} = require("../../shared/utils/generateOTP");

const createOtp = () => ({
    otp: generateOtp(),
    otpExpiry: otpExpiry(),
});

module.exports = {
    createOtp,
};