import { z } from "zod";

export const profileSchema = z.object({
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
        .string({ required_error: "Phone number is required.", })
        .trim()
        .regex(/^(03\d{9}|\+923\d{9}|923\d{9})$/,
            "Enter a valid Pakistani mobile number (e.g. 03123456789, +923123456789, or 923123456789)."
        ),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(8, "Current password is required"),

        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password cannot exceed 20 characters")
            .regex(/[A-Z]/, "Must contain an uppercase letter")
            .regex(/[a-z]/, "Must contain a lowercase letter")
            .regex(/[0-9]/, "Must contain a number")
            .regex(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Must contain a special character"
            ),

        confirmNewPassword: z.string(),
    })
    .refine(
        (data) => data.newPassword === data.confirmNewPassword,
        {
            message: "Passwords do not match",
            path: ["confirmNewPassword"],
        }
    );

export const deleteAccountSchema = z.object({
    password: z
        .string()
        .min(1, "Password is required"),

    confirmText: z
        .string()
        .refine(
            (value) => value === "DELETE",
            {
                message: 'Type "DELETE" to confirm',
            }
        ),
});