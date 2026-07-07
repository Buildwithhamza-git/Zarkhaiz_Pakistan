import { z } from "zod";

export const signupSchema = z.object({
    firstname: z.string().min(2, "First name is required"),
    lastname: z.string().min(2, "Last name is required"),
    username: z.string().min(3, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password is required"),
    phone: z.string().min(11, "Invalid phone number"),
    address: z.string().min(3, "Address is required"),
    city: z.string().min(2, "City is required"),
    province: z.string().min(2, "Province is required"),
    postalCode: z.string().optional(),
    role: z.enum(["farmer", "seller"]),
    storeName: z.string().optional(),
})
.refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
)

export const loginSchema = z.object({
    email: z
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});


export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

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
    email: z.string().email("Enter a valid email address")
})