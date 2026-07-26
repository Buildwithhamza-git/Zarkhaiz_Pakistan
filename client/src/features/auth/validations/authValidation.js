import { z } from "zod";

export const signupSchema = z
    .object({
        firstname: z
            .string()
            .trim()
            .min(3, "First name must be at least 2 characters")
            .max(20, "First name cannot exceed 20 characters")
            .regex(/^[A-Za-z\s]+$/, "First name can only contain letters"),

        lastname: z
            .string()
            .trim()
            .min(3, "Last name must be at least 3 characters")
            .max(20, "Last name cannot exceed 20 characters")
            .regex(/^[A-Za-z\s]+$/, "Last name can only contain letters"),

        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username cannot exceed 20 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscore"),

        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Please enter a valid email address")
            .refine((email) => {
                const localPart = email.split("@")[0];
                return !localPart.includes("+");
            }, {
                message: "Email aliases using '+' are not allowed",
            }),
        phone: z
            .string({
                required_error: "Phone number is required.",
            })
            .trim()
            .regex(
                /^(03\d{9}|\+923\d{9}|923\d{9})$/,
                "Enter a valid Pakistani mobile number (e.g. 03123456789, +923123456789, or 923123456789)."
            ),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password cannot exceed 20 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),

        confirmPassword: z
            .string()
            .min(1, "Confirm password is required"),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        { message: "Passwords do not match", path: ["confirmPassword"], }
    );

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address")
        .refine((email) => {
            const localPart = email.split("@")[0];
            return !localPart.includes("+");
        }, {
            message: "Email using '+' are not allowed",
        }),


    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password cannot exceed 20 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});


export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password cannot exceed 20 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),

        confirmPassword: z.string(),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Passwords do not match",
        }
    );


export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address")
        .refine((email) => {
            const localPart = email.split("@")[0];
            return !localPart.includes("+");
        }, {
            message: "Email  using '+' are not allowed",
        }),
})