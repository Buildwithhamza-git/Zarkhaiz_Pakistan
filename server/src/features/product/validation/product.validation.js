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
    .positive("Price must be greater than 0."),

  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Quantity cannot be negative."),

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

  status: z
    .enum(["Active", "Inactive", "Out of Stock"])
    .optional(),

  featured: z
    .coerce
    .boolean()
    .optional(),
});

module.exports = {
  ProductSchema,
};