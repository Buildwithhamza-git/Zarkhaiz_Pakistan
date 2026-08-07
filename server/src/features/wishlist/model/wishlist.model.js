const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
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
        },

        notifySeller: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate wishlist entries for the same user + product
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;