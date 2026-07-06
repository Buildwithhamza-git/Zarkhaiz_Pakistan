const {findUserByEmail, updateUserByEmail} = require("../repositories/userrepositories")
const {sendEmail} = require("../services/emailservice")
const { OtpExpiry, generateOtp } = require("../utils/otpHelper")

const verifyOtpService = async(verifyData)=>{
    const {email, Otp} = verifyData

    const user = await findUserByEmail(email)
    if(!user){
        throw new Error ("Email is not registered")
    }

    if(user.isVerified){
        throw new Error ("Account is Already Verified") 
    }
    if(user.Otp !==Otp){
        throw new Error ("Invalid Otp")
    }
    if(new Date() > user.OtpExpire){
        throw new Error ("the Otp has Expired")
    }

    const updateUser = await updateUserByEmail(email, {
        isVerified: true,
        otp: null,
        otpExpire: null
    })
    return updateUser
}


const resendOtpService = async (Resenddata)=>{
    const {email}= Resenddata

    const user = await findUserByEmail(email)
    if(!user){
        throw new Error ("Email is not registered")
    }
    if(user.isVerified){
        throw new Error ("Account is Already Verified")
    }

    const otp = generateOtp()
    const OtpExpire = OtpExpiry()

    const updateUser = await updateUserByEmail(email, {
        otp: otp,
        otpExpire : OtpExpire
    })

    const SendOtp = await sendEmail(email, otp)

    if(!SendOtp){
        throw new Error ("Email sending failed to"+ email)
    }

    return updateUser


}



module.exports = {verifyOtpService, resendOtpService}