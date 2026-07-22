const {findUserByEmail,findUserByPhone, findUserByUsername, updateUserByEmail, createUser} = require("./auth.repository")
const {sendVerificationEmail, sendResetPasswordEmail} = require("../../shared/services/email.service")
const {hashPassword, comparePassword} = require("../../shared/utils/hashPassword")
const {generateToken} = require("../../shared/utils/jwtToken")
const {normalizeEmail} = require("../../shared/utils/normalizeEmail")
const {generateOtp, otpExpiry} = require("../../shared/utils/generateOTP")
const {createOtp} = require("./auth.helper")

const createSignupError = (message, field) => {
    const error = new Error(message);
    error.field = field;
    return error;
};

const signupService = async (signupData) => {
    const { firstname,lastname,username,email,password,phone } = signupData
    const normalemail = normalizeEmail(email)

    const emailExist = await findUserByEmail(normalemail)

    if (emailExist) {
        throw createSignupError("The Email Already Registered", "email")
    }

    const phoneExist = await findUserByPhone(phone)
    if (phoneExist) {
        throw createSignupError("The Phone no is Already Registered", "phone")
    }

    const usernameExist = await findUserByUsername(username)
    if (usernameExist) {
        throw createSignupError("The Username Already Exist", "username")
    }

    const { otp, otpExpiry } = createOtp()
    const hashedPassword = await hashPassword(password)

    const userData = {
    firstname,
    lastname,
    username,
    email:normalemail,
    password: hashedPassword,
    phone,
    role: "user",
    sellerStatus: "none",
    otp,
    otpExpire: otpExpiry,
    isVerified: false,
};

    const user = await createUser(userData);

    const emailsend = await sendVerificationEmail(normalemail, otp);

    if (!emailsend) {
        console.warn(`Email sending failed for ${normalemail}, but signup record was created.`);
    }

    return user;

}

const loginService = async (logindata) => {
    console.log(logindata);
    const { email, password } = logindata;
    const normalemail = normalizeEmail(email)
    const User = await findUserByEmail(normalemail)
    if (!User) {
        throw new Error("The Email Doesnot Registered")
    }
    const isMatch = await comparePassword(password, User.password)
    if (!isMatch) {
        throw new Error("Invalid Password or Email")
    }
    const token = await generateToken(User)

    return { User, token }

}
const forgotPasswordService = async (forgotData) => {
    const { email } = forgotData;
    const normalemail = normalizeEmail(email)
    const user = await findUserByEmail(normalemail);
    if (!user) {
        throw new Error("Email is not registered");
    }
    const otpcombine = createOtp()
    const { otp, otpExpiry } = otpcombine ;

    await updateUserByEmail(normalemail, {
        otp: otp,
        otpExpire: otpExpiry,
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


const verifyOtpService = async(verifyData)=>{
    const {email, otp: otpValue, Otp} = verifyData
    const otpCode = otpValue ?? Otp

    const user = await findUserByEmail(email)
    if(!user){
        throw new Error ("Email is not registered")
    }

    if(user.isVerified){
        throw new Error ("Account is Already Verified") 
    }
    
    if(user.otp !== otpCode){
        throw new Error ("Invalid Otp")
    }
    if(new Date() > user.otpExpire){
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
    const otpExpire = otpExpiry()

    const updateUser = await updateUserByEmail(email, {
        otp: otp,
        otpExpire : otpExpire
    })

    const SendOtp = await sendResetPasswordEmail(email, otp)

    if(!SendOtp){
        throw new Error ("Email sending failed to"+ email)
    }

    return updateUser
}

module.exports = {signupService,loginService,forgotPasswordService, verifyOtpService,verifyResetOtpService,resendOtpService,resetPasswordService}
