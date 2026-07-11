const nodemailer = require("nodemailer")

const transport  = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASSWORD

    }
})

const sendEmail = async(email,otp)=>{
    try{
        if (!process.env.USER_EMAIL || !process.env.EMAIL_PASSWORD) {
            console.warn("Email credentials missing. Skipping actual email delivery for local testing.");
            return true;
        }

        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Your Otp For Email verification",
            html:
                `<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1 style="color: #indigo; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
                <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                </div>`
        })
        return true
    }catch(err){
        console.log(err);
        return false
    }
}

const sendResetPasswordEmail = async (email, otp) => {
    try {
        if (!process.env.USER_EMAIL || !process.env.EMAIL_PASSWORD) {
            console.warn(
                "Email credentials missing. Skipping actual email delivery for local testing."
            );
            return true;
        }

        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Reset Your Zarkhaiz Pakistan Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 10px;">
                    
                    <h2 style="color: #166534; text-align: center;">
                        Reset Your Password
                    </h2>

                    <p>Hello,</p>

                    <p>
                        We received a request to reset the password for your
                        <strong>Zarkhaiz Pakistan</strong> account.
                    </p>

                    <p style="text-align: center; margin: 30px 0;">
                        <span style="
                            display: inline-block;
                            background: #166534;
                            color: #ffffff;
                            padding: 15px 30px;
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 5px;
                            border-radius: 8px;
                        ">
                            ${otp}
                        </span>
                    </p>

                    <p style="text-align: center;">
                        This OTP is valid for
                        <strong>5 minutes</strong>.
                    </p>

                    <p>
                        If you did not request a password reset, you can safely
                        ignore this email. Your password will remain unchanged.
                    </p>

                    <hr style="margin: 25px 0;" />

                    <p style="font-size: 12px; color: #6b7280; text-align: center;">
                        This is an automated email. Please do not reply.
                    </p>

                    <p style="font-size: 12px; color: #6b7280; text-align: center;">
                        © ${new Date().getFullYear()} Zarkhaiz Pakistan. All rights reserved.
                    </p>

                </div>
            `,
        });

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

module.exports ={sendEmail, sendResetPasswordEmail}