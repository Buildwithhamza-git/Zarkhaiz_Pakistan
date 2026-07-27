import { z } from "zod";

export const productSchema = z.object({
  category: z
    .string()
    .min(1, "Please select a category"),

  name: z
    .string()
    .trim()
    .min(5, "Product name must be at least 5 characters")
    .max(100, "Product name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(3000, "Description too long"),

  price: z.coerce
    .number()
    .min(1 , "Price must be greater than or equal to 1"),

  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative"),

  unit: z.enum(
    ["kg", "g", "ton", "litre", "ml", "bag", "packet", "piece", "dozen"],
    {
      errorMap: () => ({
        message: "Please select a valid unit",
      }),
    }
  ),

  status: z.enum(["Active", "Inactive", "Out of Stock"], {
    errorMap: () => ({
      message: "Please select a valid status",
    }),
  }),

  featured: z.boolean().optional(),
}).refine((data) => {
  if (data.status === "Out of Stock" && data.stock > 0) {
    return false;
  }
  return true;
}, {
  message: "Stock must be 0 when status is 'Out of Stock'",
  path: ["stock"],
})