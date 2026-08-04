const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        unit: {
            type: String,
            default: "piece",
        },

        image: {
            type: String,
            default: "",
        },
    },
    {
        _id: false,
    }
);

const shippingAddressSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        province: {
            type: String,
            required: true,
            trim: true,
        },

        postalCode: {
            type: String,
            trim: true,
        },

        country: {
            type: String,
            default: "Pakistan",
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const totalsSchema = new mongoose.Schema(
    {
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        deliveryFee: {
            type: Number,
            default: 0,
            min: 0,
        },

        total: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },

        totals: {
            type: totalsSchema,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["COD"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
            index: true,
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ "items.seller": 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
