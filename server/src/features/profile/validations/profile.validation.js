const { z } = require("zod");

const updateProfileSchema = z.object({
    firstname: z
        .string({ required_error: "First name is required" })
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(20, "First name cannot exceed 20 characters")
        .regex(/^[A-Za-z\s]+$/, "First name can only contain letters"),

    lastname: z
        .string({ required_error: "Last name is required" })
        .trim()
        .min(3, "Last name must be at least 3 characters")
        .max(20, "Last name cannot exceed 20 characters")
        .regex(/^[A-Za-z\s]+$/, "Last name can only contain letters"),

    username: z
        .string({ required_error: "Username is required" })
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),

    phone: z
        .string({ required_error: "Phone number required." })
        .trim()
        .regex(
            /^(03\d{9}|\+923\d{9}|923\d{9})$/,
            "Enter a valid Pakistani mobile number"
        ),
});


// 🔐 CHANGE PASSWORD (PRODUCTION LEVEL)
const changePasswordSchema = z
    .object({
        currentPassword: z
            .string({ required_error: "Current password is required" })
            .trim()
            .min(8, "Password must be at least 8 characters"),

        newPassword: z
            .string({ required_error: "New password is required" })
            .trim()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password cannot exceed 20 characters")
            .regex(/[A-Z]/, "Must contain uppercase letter")
            .regex(/[a-z]/, "Must contain lowercase letter")
            .regex(/[0-9]/, "Must contain a number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain special character"),

        confirmPassword: z
            .string({ required_error: "Confirm password is required" })
            .trim(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from current password",
        path: ["newPassword"],
    });

module.exports = {
    updateProfileSchema,
    changePasswordSchema,
};