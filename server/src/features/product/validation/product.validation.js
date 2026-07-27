const { z } = require("zod");

const ProductSchema = z.object({
  category: z
    .string()
    .min(1, "Category is required"),

  name: z
    .string()
    .trim()
    .min(5, "Product name must be at least 5 characters.")
    .max(100),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(3000),

  price: z.coerce
    .number()
    .min(0, "Price must be greater than or equal to 0."),

  stock: z.coerce
    .number()
    .int()
    .nonnegative("Stock cannot be negative.")
    .optional(),

  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Quantity cannot be negative.")
    .optional(),

  unit: z.enum(
    [
      "kg",
      "g",
      "ton",
      "litre",
      "ml",
      "bag",
      "packet",
      "piece",
      "dozen",
    ],
    {
      errorMap: () => ({
        message: "Please select a valid unit.",
      }),
    }
  ),

  slug: z.string().trim().min(1).max(120).optional(),
  discountPrice: z.coerce.number().min(0).optional(),
  brand: z.string().trim().max(100).optional(),
  tags: z.array(z.string()).optional(),

  status: z
    .enum(["Active", "Inactive", "Out of Stock"])
    .optional(),

  featured: z.preprocess((value) => {
    if (typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
    }

    return value;
  }, z.boolean().optional()),
}).transform((data) => ({
  ...data,
  stock: Number(data.stock ?? data.quantity ?? 0),
}));

const ProductUpdateSchema = z.object({
  category: z.string().min(1, "Category is required").optional(),
  name: z.string().trim().min(5, "Product name must be at least 5 characters.").max(100).optional(),
  description: z.string().trim().min(10, "Description must be at least 10 characters.").max(3000).optional(),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0.").optional(),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative.").optional(),
  quantity: z.coerce.number().int().nonnegative("Quantity cannot be negative.").optional(),
  unit: z.enum([
    "kg",
    "g",
    "ton",
    "litre",
    "ml",
    "bag",
    "packet",
    "piece",
    "dozen",
  ], {
    errorMap: () => ({ message: "Please select a valid unit." }),
  }).optional(),
  slug: z.string().trim().min(1).max(120).optional(),
  discountPrice: z.coerce.number().min(0).optional(),
  brand: z.string().trim().max(100).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["Active", "Inactive", "Out of Stock"]).optional(),
  featured: z.preprocess((value) => {
    if (typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
    }
    return value;
  }, z.boolean().optional()),
}).transform((data) => ({
  ...data,
  stock: data.stock ?? data.quantity ?? undefined,
}));

module.exports = {
  ProductSchema,
  ProductUpdateSchema,
};