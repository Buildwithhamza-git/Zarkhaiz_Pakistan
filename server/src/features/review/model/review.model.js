const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true,
        },

        // The specific order item that was purchased (present on new orders).
        orderItem: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
            index: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        title: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "",
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        images: {
            type: [String],
            default: [],
        },

        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },

        // Users who found this review helpful.
        helpfulUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        // Denormalized counter so "Most Helpful" sorting stays fast.
        helpfulCount: {
            type: Number,
            default: 0,
        },

        // Users who reported this review (admin moderation).
        reportUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        reportReason: {
            type: String,
            trim: true,
            maxlength: 200,
            default: "",
        },

        status: {
            type: String,
            enum: ["pending", "approved", "hidden", "rejected"],
            default: "approved",
            index: true,
        },

        sellerReply: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        sellerRepliedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// A customer can review a product only once.
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Fast lookups of a product's public reviews.
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });

// Seller review dashboard lookups.
reviewSchema.index({ seller: 1, status: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
