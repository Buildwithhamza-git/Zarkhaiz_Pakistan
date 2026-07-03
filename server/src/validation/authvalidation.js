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
    
    storename:z
    .string()
    .trim()
    .optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot exceed 20 characters")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
            {message: "Password must contain at least one letter, one number, and one special character"}
        ),

    confirmPassword: z
        .string({ required_error: "Confirm Password is required" })
        .trim(),

    phone: z
      .string()
      .trim()
      .regex(/^(\+92|0)3[0-9]{9}$/,"Enter a valid Pakistani phone number"),

    profilePicture: z
      .string()
      .url("Profile picture must be a valid URL")
      .optional()
      .or(z.literal("")),

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

    country: z
      .string()
      .trim()
      .default("Pakistan"),

    postalCode: z
      .string()
      .trim()
      .optional(),

    role: z.enum(["farmer", "seller", "admin"]).default("farmer"),
  })
  .refine((data)=> data.password === confirmPassword,{
    message: "Confrim Password Must Match Password",
    path:[confirmPassword   ]
  })
   .superRefine((data, ctx) => {
        if (data.role === "seller" && (!data.storename || data.storename.trim() === "")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Store name is required for sellers",
                path: ["storename"],
            });
        }
    });
module.exports = {signupSchema};