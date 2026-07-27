const { z } = require("zod");

const CreateCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Category name must be at least 2 characters.")
        .max(50, "Category name cannot exceed 50 characters."),

    description: z
        .string()
        .trim()
        .max(300, "Description cannot exceed 300 characters.")
        .optional()
        .or(z.literal("")),

    // 🔥 NEW: parent category (for subcategories)
    parent: z
        .string()
        .optional()
        .nullable()
        .or(z.literal("")),

    isActive: z.boolean().optional(),
});


// 🔥 UPDATE SCHEMA
const UpdateCategorySchema = CreateCategorySchema.partial();

module.exports = {
    CreateCategorySchema,
    UpdateCategorySchema,
};