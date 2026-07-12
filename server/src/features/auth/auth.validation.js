const { z } = require("zod");

const signupSchema = z
  .object({
    firstname: z
      .string({required_error: "First name is required"})
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(20, "First name cannot exceed 20 characters")
      .regex(/^[A-Za-z\s]+$/,"First name can only contain letters"),

    lastname: z
      .string({required_error: "Last name is required"})
      .trim()
      .min(3, "Last name must be at least 3 characters")
      .max(20, "Last name cannot exceed 20 characters")
      .regex(/^[A-Za-z\s]+$/,"Last name can only contain letters"),

    username: z
      .string({required_error: "Username is required"})
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/,"Username can only contain letters, numbers and underscores"),

    email: z
      .string({required_error: "Email is required",})
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
      .string({required_error: "Phone number is required"})
      .trim()
      .regex(/^03[0-9]{9}$/,"Enter a valid phone number"),

    password: z
      .string({required_error: "Password is required",})
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot exceed 20 characters")
      .regex(/[A-Z]/,"Password must contain at least one uppercase letter")
      .regex(/[a-z]/,"Password must contain at least one lowercase letter")
      .regex(/[0-9]/,"Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/,"Password must contain at least one special character"),

    confirmPassword: z
      .string({required_error: "Confirm password is required",})
      .trim(),
  })

  .refine(
    (data) => data.password === data.confirmPassword,
    {message: "Passwords do not match",path: ["confirmPassword"],}
  );



  const verifyOtpSchema = z.object({
    email: z
        .string({ required_error: "email is required" })
        .trim()
        .toLowerCase()
        .email("Invalid Email Format"),
    otp: z
        .string({ required_error: "Otp is Required" })
        .trim()
        .length(6, "Otp must be Exactly 6 digits")
        .regex(/^[0-9]+$/, "OTP must contain only digits")
})


const resendOtpSchema=z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .toLowerCase()
        .email("Invalid Email Format")
        .refine((email) => {
                const localPart = email.split("@")[0];
                return !localPart.includes("+");
            }, {
                message: "Email aliases using '+' are not allowed",
            }),
})


const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid Email Format")
    .refine((email) => {
                const localPart = email.split("@")[0];
                return !localPart.includes("+");
            }, {
                message: "Email aliases using '+' are not allowed",
            }),

  password: z
    .string()
    .min(8, "Password is required")
})



const forgotPasswordSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .toLowerCase()
        .email("Invalid email format"),
});

const validateResetOtpSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Please enter a valid email address")
        .toLowerCase(),

    otp: z
        .string({ required_error: "OTP is required" })
        .trim()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only numbers"),
});


const resetPasswordSchema = z.object({
        email: z
            .string()
            .trim()
            .email("Invalid Email"),

        password: z
            .string()
            .min(8)
            .max(20)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                "Password must contain uppercase, lowercase, number and special character"
            ),

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });


module.exports = { signupSchema, loginSchema, verifyOtpSchema , forgotPasswordSchema ,validateResetOtpSchema, resendOtpSchema, resetPasswordSchema };