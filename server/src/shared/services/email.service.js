const nodemailer = require("nodemailer")

const transport  = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASSWORD

    }
})

const sendVerificationEmail = async(email,otp)=>{
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
                <h1 style="color: #166534; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
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

const formatMoney = (amount) => {
    const value = Number(amount || 0);
    return `Rs. ${value.toLocaleString("en-PK")}`;
};

const emailFooter = `
    <hr style="margin: 25px 0;" />
    <p style="font-size: 12px; color: #6b7280; text-align: center;">
        This is an automated email from Zarkhaiz Pakistan. Please do not reply.
    </p>
`;

/**
 * Order confirmation email to the customer.
 */
const sendOrderConfirmationEmail = async (email, order) => {
    try {
        if (!process.env.USER_EMAIL || !process.env.EMAIL_PASSWORD) {
            console.warn(
                "Email credentials missing. Skipping order confirmation email."
            );
            return true;
        }

        const rows = order.items
            .map(
                (item) => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity} ${item.unit}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatMoney(item.price)}</td>
                </tr>`
            )
            .join("");

        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: `Order Confirmed: ${order.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 10px;">
                    <h2 style="color: #166534; text-align: center;">Order Confirmed</h2>
                    <p>Hello,</p>
                    <p>
                        Your order <strong>${order.orderNumber}</strong> has been
                        placed successfully. Here are the details:
                    </p>
                    <p>
                        <strong>Total:</strong> ${formatMoney(order.totals.total)}<br />
                        <strong>Payment Method:</strong> ${order.paymentMethod}<br />
                        <strong>Shipping To:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.province}
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr>
                                <th style="padding: 8px; border-bottom: 2px solid #166534; text-align: left;">Item</th>
                                <th style="padding: 8px; border-bottom: 2px solid #166534;">Qty</th>
                                <th style="padding: 8px; border-bottom: 2px solid #166534; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <p style="text-align: center; margin: 25px 0;">
                        <span style="display: inline-block; background: #166534; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: bold;">
                            ${order.orderNumber}
                        </span>
                    </p>
                    ${emailFooter}
                </div>
            `,
        });

        return true;
    } catch (err) {
        console.error("Order confirmation email error:", err);
        return false;
    }
};

/**
 * Notify an admin when a new order is placed.
 */
const sendAdminOrderNotificationEmail = async (adminEmail, order) => {
    try {
        if (!process.env.USER_EMAIL || !process.env.EMAIL_PASSWORD) {
            console.warn(
                "Email credentials missing. Skipping admin order notification email."
            );
            return true;
        }

        const customerName =
            order.shippingAddress?.fullName || "Customer";

        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: adminEmail,
            subject: `New Order: ${order.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 10px;">
                    <h2 style="color: #166534; text-align: center;">New Order Received</h2>
                    <p>
                        A new order has been placed on Zarkhaiz Pakistan.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr>
                            <td style="padding: 8px;"><strong>Order Number</strong></td>
                            <td style="padding: 8px;">${order.orderNumber}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Customer</strong></td>
                            <td style="padding: 8px;">${customerName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Items</strong></td>
                            <td style="padding: 8px;">${order.items.length}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Total</strong></td>
                            <td style="padding: 8px;">${formatMoney(order.totals.total)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Payment</strong></td>
                            <td style="padding: 8px;">${order.paymentMethod} (${order.paymentStatus})</td>
                        </tr>
                    </table>
                    ${emailFooter}
                </div>
            `,
        });

        return true;
    } catch (err) {
        console.error("Admin order notification email error:", err);
        return false;
    }
};

/**
 * Notify the customer about an order status change.
 */
const sendOrderStatusEmail = async (order, newStatus) => {
    try {
        const user = await require("../../features/users/user.model").User.findById(
            order.user
        );

        if (!user?.email) {
            return false;
        }

        if (!process.env.USER_EMAIL || !process.env.EMAIL_PASSWORD) {
            console.warn(
                "Email credentials missing. Skipping order status email."
            );
            return true;
        }

        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: user.email,
            subject: `Order ${order.orderNumber} is now ${newStatus}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 10px;">
                    <h2 style="color: #166534; text-align: center;">Order Status Update</h2>
                    <p>Hello,</p>
                    <p>
                        Your order <strong>${order.orderNumber}</strong> status
                        has changed to <strong>${newStatus}</strong>.
                    </p>
                    ${emailFooter}
                </div>
            `,
        });

        return true;
    } catch (err) {
        console.error("Order status email error:", err);
        return false;
    }
};

module.exports ={sendVerificationEmail, sendResetPasswordEmail, sendOrderConfirmationEmail, sendAdminOrderNotificationEmail, sendOrderStatusEmail}