const { findUserByEmail, findUserByPhone, createUser, findUserByUsername } = require("../repositories/userrepositories")
const { createOtp } = require("../services/otpservice")
const { hashPassword, comparePassword } = require("../utils/passwordhelper")
const { sendEmail } = require("../services/emailservice")
const { generateToken } = require("../utils/jwtToken")
const {normalizeEmail} = require("../utils/emailhelper")

const createSignupError = (message, field) => {
    const error = new Error(message);
    error.field = field;
    return error;
};

const signupservice = async (signupData) => {
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

    const { otp, OtpExpiry } = createOtp()
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
    otpExpire: OtpExpiry,
    isVerified: false,
};

    const user = await createUser(userData);

    const emailsend = await sendEmail(normalemail, otp);

    if (!emailsend) {
        console.warn(`Email sending failed for ${normalemail}, but signup record was created.`);
    }

    return user;

}

const loginservice = async (logindata) => {
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

module.exports = {signupservice , loginservice}