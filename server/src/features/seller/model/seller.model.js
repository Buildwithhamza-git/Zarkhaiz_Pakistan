const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        storeName: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        province: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        businessType: {
            type: String,
            enum: [
                "Individual",
                "Farmer",
                "Company"
            ],
            required: true,
        },

        cnic: {
            type: String,
            required: true,
            unique: true,
        },
        logo: {
            type: String,
            default: "",
        },

        bankName: {
            type: String,
            trim: true,
        },

        accountTitle: {
            type: String,
            required: true,
            trim:true
        },

        iban: {
            type: String,
            trim: true,
        },

        jazzCash: {
            type: String,
            trim: true
        },

        easyPaisa: {
            type: String,
            trim: true
        },

        cnicFront: {
            type: String,
        },

        cnicBack: {
            type: String,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Seller", sellerSchema);