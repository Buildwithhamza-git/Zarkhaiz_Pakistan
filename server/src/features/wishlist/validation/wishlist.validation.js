const { z } = require("zod");

const addToWishlistSchema = z.object({
    productId: z
        .string({ required_error: "Product ID is required." })
        .trim()
        .min(1, "Product ID is required."),

    notifySeller: z.boolean().optional().default(false),
});

module.exports = {
    addToWishlistSchema,
};