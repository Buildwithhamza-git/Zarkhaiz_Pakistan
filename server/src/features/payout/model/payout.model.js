const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "paid", "rejected", "cancelled"],
            default: "pending",
            index: true,
        },

        method: {
            type: String,
            enum: ["bank", "jazzcash", "easypaisa"],
            default: "bank",
        },

        reference: {
            type: String,
            default: "",
        },

        adminNote: {
            type: String,
            default: "",
        },

        processedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

payoutSchema.index({ seller: 1, createdAt: -1 });

module.exports = mongoose.model("Payout", payoutSchema);
