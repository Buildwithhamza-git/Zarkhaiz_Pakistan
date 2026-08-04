const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastReadAt: {
            type: Date,
            default: null,
        },
        unreadCount: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const conversationSchema = new mongoose.Schema(
    {
        participants: {
            type: [participantSchema],
            required: true,
            validate: {
                validator: (value) =>
                    Array.isArray(value) && value.length === 2,
                message: "A conversation must have exactly two participants.",
            },
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: null,
        },

        lastMessage: {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            text: {
                type: String,
                default: "",
                trim: true,
                maxlength: 2000,
            },
            createdAt: {
                type: Date,
                default: null,
            },
        },

        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

conversationSchema.index({ "participants.user": 1, lastMessageAt: -1 });
conversationSchema.index({ seller: 1, lastMessageAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
