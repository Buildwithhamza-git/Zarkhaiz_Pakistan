const { z } = require("zod");

const chatService = require("./chat.service");
const { emitToUser } = require("../../socket");

const {
    sendMessageSocketSchema,
    editMessageSocketSchema,
    deleteMessageSocketSchema,
    deliveredSocketSchema,
    markReadSocketSchema,
} = require("./chat.validation");

const safeParse = (schema, payload) => {
    const result = schema.safeParse(payload);

    if (!result.success) {
        return {
            error: result.error.issues[0]?.message || "Invalid payload.",
        };
    }

    return { data: result.data };
};

/**
 * Register Socket.IO chat handlers for a connected socket.
 */
const registerChatHandlers = (socket) => {
    const userId = socket.userId;

    // ======================================
    // Send a message
    // ======================================
    socket.on("chat:send_message", async (payload = {}) => {
        const { data, error } = safeParse(sendMessageSocketSchema, payload);

        if (error) {
            socket.emit("chat:error", { error, tempId: payload?.tempId });
            return;
        }

        try {
            const message = await chatService.createMessageService(userId, {
                conversationId: data.conversationId,
                text: data.text,
            });

            socket.emit("chat:message_saved", {
                tempId: payload.tempId,
                message,
            });
        } catch (err) {
            socket.emit("chat:error", {
                error: err?.message || "Failed to send message.",
                tempId: payload.tempId,
            });
        }
    });

    // ======================================
    // Edit a message (sender only)
    // ======================================
    socket.on("chat:edit_message", async (payload = {}) => {
        const { data, error } = safeParse(editMessageSocketSchema, payload);

        if (error) {
            socket.emit("chat:error", {
                error,
                messageId: payload?.messageId,
            });
            return;
        }

        try {
            const message = await chatService.updateMessageService(userId, {
                messageId: data.messageId,
                text: data.text,
            });

            socket.emit("chat:message_edited", {
                message,
                conversationId: String(message.conversation),
            });
        } catch (err) {
            socket.emit("chat:error", {
                error: err?.message || "Failed to edit message.",
                messageId: payload?.messageId,
            });
        }
    });

    // ======================================
    // Delete a message for everyone (sender only)
    // ======================================
    socket.on("chat:delete_message", async (payload = {}) => {
        const { data, error } = safeParse(deleteMessageSocketSchema, payload);

        if (error) {
            socket.emit("chat:error", {
                error,
                messageId: payload?.messageId,
            });
            return;
        }

        try {
            const message = await chatService.deleteMessageService(userId, {
                messageId: data.messageId,
            });

            socket.emit("chat:message_deleted", {
                message,
                conversationId: String(message.conversation),
            });
        } catch (err) {
            socket.emit("chat:error", {
                error: err?.message || "Failed to delete message.",
                messageId: payload?.messageId,
            });
        }
    });

    // ======================================
    // Acknowledge messages as delivered
    // ======================================
    socket.on("chat:delivered", async (payload = {}) => {
        const { data } = safeParse(deliveredSocketSchema, payload);

        if (!data) return;

        try {
            await chatService.markDeliveredService(userId, data);
        } catch (err) {
            console.error("chat:delivered error:", err);
        }
    });

    // ======================================
    // Mark conversation as read
    // ======================================
    socket.on("chat:mark_read", async (payload = {}) => {
        const { data, error } = safeParse(markReadSocketSchema, payload);

        if (error) return;

        try {
            await chatService.markConversationReadService(
                userId,
                data.conversationId
            );
        } catch (err) {
            console.error("chat:mark_read error:", err);
        }
    });

    // ======================================
    // Typing indicator
    // ======================================
    socket.on("chat:typing", async (payload = {}) => {
        const conversationId = payload?.conversationId;

        if (!conversationId || typeof conversationId !== "string") {
            return;
        }

        try {
            const conversation =
                await chatService.getConversationService(userId, conversationId);

            const otherUserId = conversation.otherUser?._id;

            if (otherUserId) {
                emitToUser(otherUserId, "chat:typing", {
                    conversationId,
                    userId,
                    isTyping: Boolean(payload.isTyping),
                });
            }
        } catch (err) {
            // Ignore: typing is best-effort
        }
    });
};

module.exports = { registerChatHandlers };
