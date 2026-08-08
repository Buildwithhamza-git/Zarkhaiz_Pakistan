const mongoose = require("mongoose");

const AppError = require("../../shared/utils/AppError");
const { emitToUser, isUserOnline } = require("../../socket");

const Seller = require("../seller/model/seller.model");
const Product = require("../product/product.model");
const chatRepository = require("./chat.repository");

const serializeMessage = (message) => ({
    _id: message._id,
    conversation: message.conversation,
    sender: message.sender,
    receiver: message.receiver,
    text: message.text,
    deliveredAt: message.deliveredAt,
    readAt: message.readAt,
    editedAt: message.editedAt,
    deletedAt: message.deletedAt,
    createdAt: message.createdAt,
});

const serializeConversation = (conversation, userId) => {
    const participants = conversation.participants || [];

    const me = participants.find(
        (p) => String(p.user?._id || p.user) === String(userId)
    );

    const other = participants.find(
        (p) => String(p.user?._id || p.user) !== String(userId)
    );

    const seller = conversation.seller || {};
    const sellerUserId = String(seller.user?._id || seller.user || "");

    const product = conversation.product || {};
    const productImage = Array.isArray(product.images)
        ? typeof product.images[0] === "string"
            ? product.images[0]
            : product.images[0]?.url
        : null;

    const otherUserId = String(other?.user?._id || other?.user || "");

    return {
        _id: conversation._id,
        seller: {
            _id: seller._id,
            storeName: seller.storeName || "Seller",
            logo: seller.logo || "",
        },
        product: product._id
            ? {
                  _id: product._id,
                  name: product.name || "Product",
                  image: productImage || null,
              }
            : null,
        otherUser: {
            _id: other?.user?._id || other?.user,
            firstname: other?.user?.firstname || "",
            lastname: other?.user?.lastname || "",
            email: other?.user?.email || "",
            username: other?.user?.username || "",
            online: otherUserId ? isUserOnline(otherUserId) : false,
        },
        isSellerSide: String(userId) === sellerUserId,
        lastMessage: conversation.lastMessage || null,
        lastMessageAt: conversation.lastMessageAt || conversation.createdAt,
        unreadCount: me?.unreadCount || 0,
    };
};

// =======================================
// Start / find a conversation
// =======================================

const startConversationService = async (userId, { sellerId, productId = null, initialMessage = "" }) => {
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
        throw new AppError("Invalid seller id.", 400);
    }

    const seller = await Seller.findById(sellerId).lean();

    if (!seller) {
        throw new AppError("Seller not found.", 404);
    }

    const sellerUserId = String(seller.user);

    if (sellerUserId === String(userId)) {
        throw new AppError("You cannot start a chat with yourself.", 400);
    }

    let product = null;

    if (productId) {
        product = await Product.findById(productId).select("name images seller").lean();

        if (!product) {
            throw new AppError("Product not found.", 404);
        }

        if (String(product.seller) !== String(sellerId)) {
            throw new AppError("This product does not belong to that seller.", 400);
        }
    }

    let conversation = await chatRepository.findConversationBetweenUsers(
        userId,
        sellerUserId
    );

    if (!conversation) {
        conversation = await chatRepository.createConversation({
            participants: [
                { user: userId, unreadCount: 0 },
                { user: sellerUserId, unreadCount: 0 },
            ],
            seller: sellerId,
            product: product ? product._id : null,
            lastMessageAt: new Date(),
        });

        conversation = await chatRepository.findConversationById(conversation._id);
    } else if (product) {
        // Keep the conversation context synced with the product being viewed
        if (String(conversation.product?._id || conversation.product || "") !== String(product._id)) {
            conversation.product = product._id;
            await conversation.save();
            conversation = await chatRepository.findConversationById(conversation._id);
        }
    }

    if (initialMessage?.trim()) {
        await createMessageService(userId, {
            conversationId: conversation._id,
            text: initialMessage.trim(),
        });
    }

    return chatRepository.findConversationById(conversation._id);
};

// =======================================
// Create a message
// =======================================

const createMessageService = async (userId, { conversationId, text }) => {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new AppError("Invalid conversation id.", 400);
    }

    const conversation = await chatRepository.findConversationById(conversationId);

    if (!conversation) {
        throw new AppError("Conversation not found.", 404);
    }

    const participants = conversation.participants || [];

    const isParticipant = participants.some(
        (p) => String(p.user?._id || p.user) === String(userId)
    );

    if (!isParticipant) {
        throw new AppError("You are not a participant of this conversation.", 403);
    }

    const receiver = participants.find(
        (p) => String(p.user?._id || p.user) !== String(userId)
    );

    if (!receiver) {
        throw new AppError("Conversation has no valid recipient.", 400);
    }

    const receiverUserId = String(receiver.user?._id || receiver.user);

    const message = await chatRepository.createMessage({
        conversation: conversationId,
        sender: userId,
        receiver: receiverUserId,
        text,
    });

    const createdAt = new Date();

    await chatRepository.updateConversationAfterMessage(conversationId, {
        senderId: userId,
        text,
        createdAt,
    });

    await chatRepository.incrementUnreadCount(conversationId, receiverUserId);

    const serialized = serializeMessage({
        ...message.toObject(),
        conversation: conversationId,
    });

    emitToUser(receiverUserId, "chat:new_message", {
        message: serialized,
        conversationId,
        lastMessage: {
            sender: userId,
            text,
            createdAt,
        },
        lastMessageAt: createdAt,
        senderUserId: userId,
    });

    return serialized;
};

// =======================================
// Edit a message (sender only)
// =======================================

const updateMessageService = async (userId, { messageId, text }) => {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        throw new AppError("Invalid message id.", 400);
    }

    const trimmed = String(text || "").trim();

    if (!trimmed) {
        throw new AppError("Message cannot be empty.", 400);
    }

    const message = await chatRepository.findMessageById(messageId);

    if (!message) {
        throw new AppError("Message not found.", 404);
    }

    if (String(message.sender) !== String(userId)) {
        throw new AppError("You can only edit your own messages.", 403);
    }

    if (message.deletedAt) {
        throw new AppError("This message was deleted and cannot be edited.", 400);
    }

    message.text = trimmed;
    message.editedAt = new Date();

    await message.save();

    await refreshConversationLastMessage(message.conversation);

    const serialized = serializeMessage({
        ...message.toObject(),
        conversation: message.conversation,
    });

    const receiverId = String(message.receiver);

    if (receiverId && receiverId !== String(userId)) {
        emitToUser(receiverId, "chat:message_edited", {
            message: serialized,
            conversationId: String(message.conversation),
        });
    }

    return serialized;
};

// =======================================
// Delete a message for everyone (sender only)
// =======================================

const deleteMessageService = async (userId, { messageId }) => {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        throw new AppError("Invalid message id.", 400);
    }

    const message = await chatRepository.findMessageById(messageId);

    if (!message) {
        throw new AppError("Message not found.", 404);
    }

    if (String(message.sender) !== String(userId)) {
        throw new AppError("You can only delete your own messages.", 403);
    }

    if (message.deletedAt) {
        throw new AppError("This message is already deleted.", 400);
    }

    await chatRepository.softDeleteMessage(messageId);

    await refreshConversationLastMessage(message.conversation);

    const serialized = serializeMessage({
        ...message.toObject(),
        text: "",
        deletedAt: new Date(),
        conversation: message.conversation,
    });

    const receiverId = String(message.receiver);

    if (receiverId && receiverId !== String(userId)) {
        emitToUser(receiverId, "chat:message_deleted", {
            message: serialized,
            conversationId: String(message.conversation),
        });
    }

    return serialized;
};

// =======================================
// Keep the conversation list preview in sync
// when the latest message is edited or deleted
// =======================================

const refreshConversationLastMessage = async (conversationId) => {
    try {
        const latest = await chatRepository.getLatestMessage(conversationId);

        if (!latest) return;

        await chatRepository.updateConversationAfterMessage(conversationId, {
            senderId: latest.sender,
            text: latest.text || "Message deleted",
            createdAt: latest.createdAt,
        });
    } catch (err) {
        console.error("refreshConversationLastMessage error:", err);
    }
};

// =======================================
// List conversations
// =======================================

const listConversationsService = async (userId, { scope = "buyer" } = {}) => {
    // Resolve the user's own seller account once (may be null for pure buyers).
    const seller = await Seller.findOne({ user: userId }).lean();

    let conversations;

    if (scope === "seller") {
        // Seller dashboard: only conversations that belong to THIS seller's
        // store (customer inquiries). A user who is also a buyer must not see
        // their buyer-side chats (started with other sellers) here.
        if (!seller) {
            return [];
        }

        conversations = await chatRepository.findConversationsForSeller(
            seller._id,
            String(userId)
        );
    } else {
        // Buyer / marketplace view: all conversations where the user is a
        // participant — except, when the user also owns a store, that store's
        // customer inquiries, which belong to the seller dashboard only.
        conversations = await chatRepository.findConversationsForUser(
            userId,
            seller ? seller._id : null
        );
    }

    return conversations.map((conversation) =>
        serializeConversation(conversation, userId)
    );
};

// =======================================
// Single conversation
// =======================================

const getConversationService = async (userId, conversationId) => {
    const conversation = await chatRepository.findConversationByIdForUser(
        conversationId,
        userId
    );

    if (!conversation) {
        throw new AppError("Conversation not found.", 404);
    }

    return serializeConversation(conversation, userId);
};

// =======================================
// Messages (paginated, newest-first internally)
// =======================================

const getMessagesService = async (userId, conversationId, { before = null, limit = 30 } = {}) => {
    const conversation = await chatRepository.findConversationByIdForUser(
        conversationId,
        userId
    );

    if (!conversation) {
        throw new AppError("Conversation not found.", 404);
    }

    const pageLimit = Math.min(60, Math.max(1, Number(limit) || 30));

    const messages = await chatRepository.findMessagesByConversation(conversationId, {
        before: before ? new Date(before) : null,
        limit: pageLimit,
    });

    // Messages that arrived on this device count as "delivered"
    const toDeliver = messages.filter(
        (m) => String(m.sender) !== String(userId) && !m.deliveredAt
    );

    if (toDeliver.length) {
        const deliveredIds = toDeliver.map((m) => m._id);

        await chatRepository.markMessagesDelivered(conversationId, userId, {
            messageIds: deliveredIds,
        });

        const now = new Date();

        for (const m of toDeliver) {
            m.deliveredAt = now;
        }

        emitToUser(String(toDeliver[0].sender), "chat:delivered", {
            conversationId,
            messageIds: deliveredIds,
            deliveredAt: now,
        });
    }

    return messages.map(serializeMessage);
};

// =======================================
// Mark conversation as read
// =======================================

const markConversationReadService = async (userId, conversationId) => {
    const conversation = await chatRepository.findConversationByIdForUser(
        conversationId,
        userId
    );

    if (!conversation) {
        throw new AppError("Conversation not found.", 404);
    }

    const result = await chatRepository.markMessagesRead(conversationId, userId);

    await chatRepository.resetUnreadCount(conversationId, userId, result.readAt);

    if (result.messageIds.length) {
        const otherParticipant = conversation.participants.find(
            (p) => String(p.user?._id || p.user) !== String(userId)
        );

        if (otherParticipant) {
            const otherUserId = String(otherParticipant.user?._id || otherParticipant.user);

            emitToUser(otherUserId, "chat:read", {
                conversationId,
                readAt: result.readAt,
                messageIds: result.messageIds,
            });
        }
    }

    return { readAt: result.readAt };
};

// =======================================
// Mark messages as delivered (socket ack)
// =======================================

const markDeliveredService = async (userId, { conversationId, messageIds = [] }) => {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return { updated: 0 };
    }

    const conversation = await chatRepository.findConversationByIdForUser(
        conversationId,
        userId
    );

    if (!conversation) {
        return { updated: 0 };
    }

    const sanitizedIds = (messageIds || [])
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .slice(0, 100);

    const updated = await chatRepository.markMessagesDelivered(
        conversationId,
        userId,
        { messageIds: sanitizedIds }
    );

    if (updated > 0) {
        const delivered = await chatRepository.findDeliveredMessageIds(
            conversationId,
            userId,
            { messageIds: sanitizedIds }
        );

        if (delivered.length) {
            const otherParticipant = conversation.participants.find(
                (p) => String(p.user?._id || p.user) !== String(userId)
            );

            if (otherParticipant) {
                const otherUserId = String(
                    otherParticipant.user?._id || otherParticipant.user
                );

                emitToUser(otherUserId, "chat:delivered", {
                    conversationId,
                    messageIds: delivered.map((m) => m._id),
                    deliveredAt: delivered[0].deliveredAt,
                });
            }
        }
    }

    return { updated };
};

// =======================================
// Presence: partner ids of a user
// =======================================

const getConversationPartnerIds = async (userId) => {
    return await chatRepository.findConversationPartnerIds(userId);
};

// =======================================
// Mark all undelivered messages delivered
// (called when a user connects to the socket)
// =======================================

const markDeliveredOnConnectService = async (userId) => {
    const { updated, groups } =
        await chatRepository.markAllMessagesDeliveredForUser(userId);

    if (updated > 0) {
        for (const group of groups) {
            emitToUser(String(group.sender), "chat:delivered", {
                conversationId: String(group.conversationId),
                messageIds: group.messageIds,
                deliveredAt: group.deliveredAt,
            });
        }
    }

    return { updated };
};

// =======================================
// Total unread count
// =======================================

const getUnreadTotalService = async (userId, { scope = "buyer" } = {}) => {
    const seller = await Seller.findOne({ user: userId }).lean();

    if (scope === "seller") {
        if (!seller) {
            return 0;
        }

        return await chatRepository.sumUnreadForSeller(seller._id, String(userId));
    }

    return await chatRepository.sumUnreadForUser(
        userId,
        seller ? seller._id : null
    );
};

// =======================================
// Customers (unique buyers per seller)
// =======================================

const getCustomersService = async (userId) => {
    const seller = await Seller.findOne({ user: userId }).lean();

    if (!seller) {
        return [];
    }

    return await chatRepository.findCustomersForSeller(
        seller._id,
        String(userId)
    );
};

module.exports = {
    startConversationService,
    createMessageService,
    updateMessageService,
    deleteMessageService,
    listConversationsService,
    getConversationService,
    getMessagesService,
    markConversationReadService,
    markDeliveredService,
    getUnreadTotalService,
    getCustomersService,
    getConversationPartnerIds,
    markDeliveredOnConnectService,
    serializeConversation,
    serializeMessage,
};
