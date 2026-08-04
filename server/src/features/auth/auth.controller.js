const { signupService,loginService,forgotPasswordService, verifyOtpService,verifyResetOtpService,resendOtpService,resetPasswordService} = require('./auth.service')
const {generateToken} = require("../../shared//utils/jwtToken")


const SignupController = async (req, res) => {
    try {
        const user = await signupService(req.body)

        return res.status(201).json({
            status: true,
            message: "Otp Send Successfully",
            email: user.email,
            userId: user._id
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
            field: err.field 
        })
    }
}

const verifyOtpController=async (req, res) => {
    try {

        const result = await verifyOtpService(req.body)
        const token = await generateToken(result)

        return res.status(200).json({
            success: true,
            message: "Account Verified Successfuly",
            token,
            user: {
                id: result._id,
                email: result.email,
                role: result.role,
                isVerified: result.isVerified 
            }
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
}}

const verifyResetOtpController = async(req, res)=>{
    try{
        const user = await verifyResetOtpService(req.body)

        return res.status(200).json({
            success:true,
            message: "Otp verified"
        })
    }catch(err){
         return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}

const resendOtpController = async (req, res) => {
    try {
        const user = await resendOtpService(req.body);

        return res.status(200).json({
            success: true,
            message: "OTP resent successfully",
            email: user.email,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const loginController = async (req, res) => {
    try {

        const user = await loginService(req.body)
        res.status(200).json({
            success: true,
            message: "The User login successfully",
            token: user.token,
            user: {
                id: user.User._id,
                email: user.User.email,
                role: user.User.role,
                firstname: user.User.firstname,
                lastname: user.User.lastname,
                isVerified:user.User.isVerified 
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
            field: "password"
        })
    }
}


const forgotPasswordController = async (req, res) => {
    try {
        const email = req.body;
        const result = await forgotPasswordService(email)

        return res.status(200).json({
            success: true,
            message: "OTP sent to email",
            email: result.normalemail,
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message, field: "email", });
    }
}


const resetPasswordController = async (req, res) => {
    try {
        await resetPasswordService(req.body);
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};


module.exports = { SignupController, verifyOtpController,verifyResetOtpController, resendOtpController,resetPasswordController, loginController, forgotPasswordController }