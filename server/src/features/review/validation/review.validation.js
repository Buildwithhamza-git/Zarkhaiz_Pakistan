const { z } = require("zod");

// ==========================================
// Create Review
// ==========================================

const createReviewSchema = z.object({
    productId: z
        .string({ required_error: "Product ID is required." })
        .trim()
        .min(1, "Product ID is required."),

    orderId: z
        .string()
        .trim()
        .min(1, "Order ID is required.")
        .optional(),

    rating: z
        .coerce
        .number({ required_error: "Rating is required." })
        .int("Rating must be a whole number.")
        .min(1, "Rating must be between 1 and 5.")
        .max(5, "Rating must be between 1 and 5."),

    title: z
        .string()
        .trim()
        .max(100, "Title must be 100 characters or less.")
        .optional()
        .default(""),

    description: z
        .string({ required_error: "Review description is required." })
        .trim()
        .min(3, "Review description must be at least 3 characters.")
        .max(1000, "Review description must be 1000 characters or less."),

    images: z
        .array(z.string().trim().min(1))
        .max(5, "You can upload up to 5 images.")
        .optional()
        .default([]),
});

// ==========================================
// Update Review (at least one field required)
// ==========================================

const updateReviewSchema = z
    .object({
        rating: z
            .coerce
            .number()
            .int("Rating must be a whole number.")
            .min(1, "Rating must be between 1 and 5.")
            .max(5, "Rating must be between 1 and 5.")
            .optional(),

        title: z
            .string()
            .trim()
            .max(100, "Title must be 100 characters or less.")
            .optional(),

        description: z
            .string()
            .trim()
            .min(3, "Review description must be at least 3 characters.")
            .max(1000, "Review description must be 1000 characters or less.")
            .optional(),

        images: z
            .array(z.string().trim().min(1))
            .max(5, "You can upload up to 5 images.")
            .optional(),

        // Kept image URLs (JSON string) sent from the FormData payload.
        existingImages: z.string().optional(),
    })
    .refine(
        (data) =>
            data.rating !== undefined ||
            data.title !== undefined ||
            data.description !== undefined ||
            data.images !== undefined,
        { message: "At least one field must be provided to update the review." }
    );

// ==========================================
// Seller Reply
// ==========================================

const sellerReplySchema = z.object({
    reply: z
        .string({ required_error: "Reply is required." })
        .trim()
        .min(1, "Reply cannot be empty.")
        .max(500, "Reply must be 500 characters or less."),
});

// ==========================================
// Report Review
// ==========================================

const reportReviewSchema = z.object({
    reason: z
        .string()
        .trim()
        .max(200, "Reason must be 200 characters or less.")
        .optional()
        .default(""),
});

// ==========================================
// Admin Review Status
// ==========================================

const reviewStatusSchema = z.object({
    status: z.enum(["pending", "approved", "hidden", "rejected"], {
        required_error: "Status is required.",
        invalid_type_error: "Invalid review status.",
    }),
});

module.exports = {
    createReviewSchema,
    updateReviewSchema,
    sellerReplySchema,
    reportReviewSchema,
    reviewStatusSchema,
};
