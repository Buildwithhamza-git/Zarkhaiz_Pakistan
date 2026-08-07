const chatService = require("./chat.service");

// ==========================================
// GET /chats/conversations
// ==========================================

const listConversations = async (req, res, next) => {
    try {
        const scope = req.query.scope === "seller" ? "seller" : "buyer";

        const conversations =
            await chatService.listConversationsService(
                req.user.userId,
                { scope }
            );

        return res.status(200).json({
            success: true,
            data: conversations,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// GET /chats/conversations/unread-count
// ==========================================

const getUnreadTotal = async (req, res, next) => {
    try {
        const scope = req.query.scope === "seller" ? "seller" : "buyer";

        const count = await chatService.getUnreadTotalService(
            req.user.userId,
            { scope }
        );

        return res.status(200).json({
            success: true,
            data: { count },
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// GET /chats/customers
// ==========================================

const getCustomers = async (req, res, next) => {
    try {
        const customers = await chatService.getCustomersService(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            data: customers,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// POST /chats/conversations
// ==========================================

const startConversation = async (req, res, next) => {
    try {
        const conversation =
            await chatService.startConversationService(
                req.user.userId,
                req.body
            );

        return res.status(201).json({
            success: true,
            message: "Conversation started.",
            data: chatService.serializeConversation(
                conversation,
                req.user.userId
            ),
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// GET /chats/conversations/:id
// ==========================================

const getConversation = async (req, res, next) => {
    try {
        const conversation =
            await chatService.getConversationService(
                req.user.userId,
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: conversation,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// GET /chats/conversations/:id/messages
// ==========================================

const getMessages = async (req, res, next) => {
    try {
        const messages = await chatService.getMessagesService(
            req.user.userId,
            req.params.id,
            req.query
        );

        return res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// POST /chats/conversations/:id/messages
// ==========================================

const createMessage = async (req, res, next) => {
    try {
        const message = await chatService.createMessageService(
            req.user.userId,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Message sent.",
            data: message,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// PATCH /chats/conversations/:id/messages/:messageId
// ==========================================

const updateMessage = async (req, res, next) => {
    try {
        const message = await chatService.updateMessageService(
            req.user.userId,
            {
                messageId: req.params.messageId,
                text: req.body.text,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Message edited.",
            data: message,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// DELETE /chats/conversations/:id/messages/:messageId
// ==========================================

const deleteMessage = async (req, res, next) => {
    try {
        const message = await chatService.deleteMessageService(
            req.user.userId,
            {
                messageId: req.params.messageId,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Message deleted for everyone.",
            data: message,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// POST /chats/conversations/:id/read
// ==========================================

const markConversationRead = async (req, res, next) => {
    try {
        const result = await chatService.markConversationReadService(
            req.user.userId,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Conversation marked as read.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listConversations,
    getUnreadTotal,
    getCustomers,
    startConversation,
    getConversation,
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    markConversationRead,
};
