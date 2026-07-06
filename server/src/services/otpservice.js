const {generateOtp, OtpExpiry} =require("../utils/otpHelper")

const createOtp = ()=>{
    return{
        otp: generateOtp(),
        OtpExpiry: OtpExpiry()
    }
}

module.exports ={createOtp}