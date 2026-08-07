const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },

        // WhatsApp-style delivery state
        deliveredAt: {
            type: Date,
            default: null,
        },

        readAt: {
            type: Date,
            default: null,
        },

        // When the message text was last edited by the sender
        editedAt: {
            type: Date,
            default: null,
        },

        // When the message was deleted for everyone by the sender
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
