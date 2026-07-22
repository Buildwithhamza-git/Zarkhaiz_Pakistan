import { z } from "zod";

export const profileSchema = z.object({
    firstname: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(20, "First name cannot exceed 20 characters")
        .regex(/^[A-Za-z\s]+$/, "First name can only contain letters"),

    lastname: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters")
        .max(20, "Last name cannot exceed 20 characters")
        .regex(/^[A-Za-z\s]+$/, "Last name can only contain letters"),

    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscore"),

    phone: z
        .string()
        .trim()
        .regex(/^03[0-9]{9}$/, "Enter a valid phone number"),

    dateOfBirth: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    address: z
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address cannot exceed 200 characters"),

    city: z
        .string()
        .trim()
        .min(2, "City is required")
        .max(50, "City cannot exceed 50 characters"),

    province: z
        .string()
        .trim()
        .min(2, "Province is required")
        .max(50, "Province cannot exceed 50 characters"),

    postalCode: z
        .string()
        .trim()
        .regex(/^[0-9]{4,10}$/, "Enter a valid postal code"),

    country: z
        .string()
        .trim()
        .min(2, "Country is required")
        .max(56, "Country cannot exceed 56 characters"),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Current password is required"),

        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password cannot exceed 20 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),

        confirmNewPassword: z
            .string()
            .min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from your current password",
        path: ["newPassword"],
    });

export const deleteAccountSchema = z.object({
    password: z
        .string()
        .min(1, "Enter your password to confirm"),

    confirmText: z
        .string()
        .refine((val) => val === "DELETE", {
            message: 'Please type "DELETE" to confirm',
        }),
});
