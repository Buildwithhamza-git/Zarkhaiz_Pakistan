const { z } = require("zod");

const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid id format.");

const startConversationSchema = z.object({
    sellerId: objectId,

    productId: objectId
        .optional()
        .nullable()
        .or(z.literal("")),

    initialMessage: z
        .string()
        .trim()
        .min(1, "Message cannot be empty.")
        .max(2000, "Message is too long.")
        .optional()
        .or(z.literal("")),
});

const createMessageSchema = z.object({
    conversationId: objectId,

    text: z
        .string()
        .trim()
        .min(1, "Message cannot be empty.")
        .max(2000, "Message is too long."),
});

const sendMessageSocketSchema = z.object({
    tempId: z.string().max(64).optional(),
    conversationId: objectId,
    text: z
        .string()
        .trim()
        .min(1, "Message cannot be empty.")
        .max(2000, "Message is too long."),
});

const markReadSocketSchema = z.object({
    conversationId: objectId,
});

const deliveredSocketSchema = z.object({
    conversationId: objectId,
    messageIds: z.array(objectId).max(100).optional().default([]),
});

module.exports = {
    startConversationSchema,
    createMessageSchema,
    sendMessageSocketSchema,
    markReadSocketSchema,
    deliveredSocketSchema,
};
