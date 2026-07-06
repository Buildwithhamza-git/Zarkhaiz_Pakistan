const { findUserByEmail, findUserByPhone, createUser, findUserByUsername } = require("../repositories/userrepositories")
const { createOtp } = require("../services/otpservice")
const { hashPassword, comparePassword } = require("../utils/passwordhelper")
const { sendEmail } = require("../services/emailservice")
const { generateToken } = require("../utils/jwtToken")

const createSignupError = (message, field) => {
    const error = new Error(message);
    error.field = field;
    return error;
};

const signupservice = async (signupData) => {
    const { firstname,
        lastname,
        username,
        email,
        password,
        phone,
        address,
        city,
        province,
        role,
        storeName,
        postalCode } = signupData

    const emailExist = await findUserByEmail(email)

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
        role,
        email,
        address,
        city,
        province,
        password: hashedPassword,
        phone,
        otp: otp,
        otpExpire: OtpExpiry,
        isVerified: false,
    }

    if (role === "seller") {
        userData.storeName = storeName;
    }

    const user = await createUser(userData);

    const emailsend = await sendEmail(email, otp);

    if (!emailsend) {
        console.warn(`Email sending failed for ${email}, but signup record was created.`);
    }

    return user;

}

const loginservice = async (logindata) => {
    const { email, password } = logindata;
    const User = await findUserByEmail(email)
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