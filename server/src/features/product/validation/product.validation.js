const { z } = require("zod");

const ProductSchema = z.object({

    category: z
        .string()
        .min(1, "Category is required"),

    productName: z
        .string()
        .trim()
        .min(3, "Product name is required")
        .max(150),

    description: z
        .string()
        .trim()
        .min(10, "Description is required")
        .max(3000),

    price: z.coerce
        .number()
        .positive("Price must be greater than 0"),

    stock: z.coerce
        .number()
        .int()
        .nonnegative("Stock cannot be negative"),

    isActive: z
        .coerce
        .boolean()
        .optional(),

});

module.exports = {
    ProductSchema,
};