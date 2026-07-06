const { z } = require("zod");

const signupSchema = z
  .object({
    firstname: z
      .string()
      .trim()
      .min(3, "First name must be at least 3 characters")
      .max(15, "First name cannot exceed 15 characters"),

    lastname: z
      .string()
      .trim()
      .min(3, "Last name must be at least 3 characters")
      .max(15, "Last name cannot exceed 15 characters"),

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username cannot exceed 15 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores"
      ),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .toLowerCase(),

    storeName: z
      .string()
      .trim()
      .optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot exceed 20 characters")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        { message: "Password must contain at least one letter, one number, and one special character" }
      ),

    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .trim(),

    phone: z
      .string()
      .trim()
      .regex(/^(\+92|0)3[0-9]{9}$/, "Enter a valid Pakistani phone number"),


    address: z
      .string()
      .trim()
      .min(5, "Address is required"),

    city: z
      .string()
      .trim()
      .min(2, "City is required"),

    province: z
      .string()
      .trim()
      .min(2, "Province is required"),

    postalCode: z
      .string()
      .trim()
      .optional(),

    role: z.enum(["farmer", "seller", "admin"]).default("farmer"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confrim Password Must Match Password",
    path: ["confirmPassword"]
  })
  .superRefine((data, ctx) => {
    if (data.role === "seller" && (!data.storeName || data.storeName.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Store name is required for sellers",
        path: ["storeName"],
      });
    }
  });


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
})


const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid Email Format"),

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

const resetPasswordSchema = z
    .object({
        email: z
            .string({ required_error: "Email is required" })
            .trim()
            .toLowerCase()
            .email("Invalid email format"),

        otp: z
            .string({ required_error: "OTP is required" })
            .trim()
            .length(6, "OTP must be exactly 6 digits")
            .regex(/^[0-9]+$/, "OTP must contain only digits"),

        newPassword: z
            .string({ required_error: "New password is required" })
            .trim()
            .min(8, "Password must be at least 8 characters long")
            .max(20, "Password cannot exceed 20 characters")
            .regex(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                "Password must contain at least one letter, one number, and one special character"
            ),

        confirmNewPassword: z
            .string({ required_error: "Confirm password is required" })
            .trim(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    });


module.exports = { signupSchema, loginSchema, verifyOtpSchema , forgotPasswordSchema , resendOtpSchema, resetPasswordSchema };