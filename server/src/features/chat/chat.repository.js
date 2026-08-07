const mongoose = require("mongoose");

const Conversation = require("./model/conversation.model");
const Message = require("./model/message.model");

const USER_SELECT = "firstname lastname email username";
const CUSTOMER_SELECT = "firstname lastname email username phone";

const SELLER_POPULATE = {
    path: "seller",
    select: "storeName logo user",
    populate: { path: "user", select: "_id" },
};

// =======================================
// Conversations
// =======================================

const findConversationBetweenUsers = async (userA, userB, productId = null) => {
    const filter = {
        "participants.user": {
            $all: [new mongoose.Types.ObjectId(userA), new mongoose.Types.ObjectId(userB)],
        },
    };

    if (productId) {
        filter.product = productId;
    }

    return await Conversation.findOne(filter)
        .populate("participants.user", USER_SELECT)
        .populate(SELLER_POPULATE);
};

const findConversationById = async (conversationId) => {
    return await Conversation.findById(conversationId)
        .populate("participants.user", USER_SELECT)
        .populate(SELLER_POPULATE)
        .populate("product", "name images");
};

const findConversationByIdForUser = async (conversationId, userId) => {
    return await Conversation.findOne({
        _id: conversationId,
        "participants.user": new mongoose.Types.ObjectId(userId),
    })
        .populate("participants.user", USER_SELECT)
        .populate(SELLER_POPULATE)
        .populate("product", "name images");
};

const createConversation = async (data) => {
    return await Conversation.create(data);
};

const findConversationsForUser = async (userId) => {
    // All conversations the user participates in, including conversations of
    // their own store (customer inquiries) so those are visible in the
    // marketplace floating chat as well as the seller dashboard.
    return await Conversation.find({
        "participants.user": new mongoose.Types.ObjectId(userId),
    })
        .sort({ lastMessageAt: -1 })
        .populate("participants.user", USER_SELECT)
        .populate(SELLER_POPULATE)
        .populate("product", "name images")
        .lean();
};

// Conversations that belong to a specific seller account (their own store).
// This is what the seller dashboard must show, so a user who is both a buyer
// and a seller never sees their buyer-side chats in the seller dashboard.
const findConversationsForSeller = async (sellerId, sellerUserId) => {
    return await Conversation.find({
        seller: sellerId,
        "participants.user": new mongoose.Types.ObjectId(sellerUserId),
    })
        .sort({ lastMessageAt: -1 })
        .populate("participants.user", USER_SELECT)
        .populate(SELLER_POPULATE)
        .populate("product", "name images")
        .lean();
};

const findConversationPartnerIds = async (userId) => {
    const conversations = await Conversation.find({
        "participants.user": new mongoose.Types.ObjectId(userId),
    })
        .select("participants.user")
        .populate("participants.user", "_id")
        .lean();

    const partnerIds = new Set();

    for (const conversation of conversations) {
        for (const participant of conversation.participants || []) {
            const participantId = String(
                participant.user?._id || participant.user || ""
            );

            if (participantId && participantId !== String(userId)) {
                partnerIds.add(participantId);
            }
        }
    }

    return [...partnerIds];
};

const updateConversationAfterMessage = async (
    conversationId,
    { senderId, text, createdAt }
) => {
    await Conversation.updateOne(
        { _id: conversationId },
        {
            $set: {
                lastMessage: {
                    sender: senderId,
                    text,
                    createdAt,
                },
                lastMessageAt: createdAt,
            },
        }
    );
};

const incrementUnreadCount = async (conversationId, receiverUserId) => {
    await Conversation.updateOne(
        {
            _id: conversationId,
            "participants.user": receiverUserId,
        },
        {
            $inc: {
                "participants.$.unreadCount": 1,
            },
        }
    );
};

const resetUnreadCount = async (conversationId, userId, readAt) => {
    await Conversation.updateOne(
        {
            _id: conversationId,
            "participants.user": userId,
        },
        {
            $set: {
                "participants.$.unreadCount": 0,
                "participants.$.lastReadAt": readAt,
            },
        }
    );
};

const sumUnreadForUser = async (userId) => {
    const match = {
        "participants.user": new mongoose.Types.ObjectId(userId),
    };

    const rows = await Conversation.aggregate([
        {
            $match: match,
        },
        {
            $project: {
                unread: {
                    $arrayElemAt: [
                        "$participants.unreadCount",
                        {
                            $indexOfArray: [
                                "$participants.user",
                                new mongoose.Types.ObjectId(userId),
                            ],
                        },
                    ],
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$unread" },
            },
        },
    ]);

    return rows.length ? rows[0].total : 0;
};

// Unread count scoped to a seller's own store only.
const sumUnreadForSeller = async (sellerId, sellerUserId) => {
    const rows = await Conversation.aggregate([
        {
            $match: {
                seller: sellerId,
                "participants.user": new mongoose.Types.ObjectId(sellerUserId),
            },
        },
        {
            $project: {
                unread: {
                    $arrayElemAt: [
                        "$participants.unreadCount",
                        {
                            $indexOfArray: [
                                "$participants.user",
                                new mongoose.Types.ObjectId(sellerUserId),
                            ],
                        },
                    ],
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$unread" },
            },
        },
    ]);

    return rows.length ? rows[0].total : 0;
};

// =======================================
// Customers (unique buyers per seller)
// =======================================

const findCustomersForSeller = async (sellerId, sellerUserId) => {
    const conversations = await Conversation.find({ seller: sellerId })
        .sort({ lastMessageAt: -1 })
        .populate("participants.user", CUSTOMER_SELECT)
        .populate(SELLER_POPULATE)
        .populate("product", "name images")
        .lean();

    if (!conversations.length) return [];

    const conversationIds = conversations.map((c) => c._id);

    const counts = await Message.aggregate([
        {
            $match: { conversation: { $in: conversationIds } },
        },
        {
            $group: { _id: "$conversation", count: { $sum: 1 } },
        },
    ]);

    const countMap = Object.fromEntries(
        counts.map((row) => [String(row._id), row.count])
    );

    return conversations.map((conversation) => {
        const me = conversation.participants.find(
            (p) => String(p.user?._id || p.user) === String(sellerUserId)
        );

        const customer = conversation.participants.find(
            (p) => String(p.user?._id || p.user) !== String(sellerUserId)
        );

        const product = conversation.product || {};
        const productImage = Array.isArray(product.images)
            ? typeof product.images[0] === "string"
                ? product.images[0]
                : product.images[0]?.url
            : null;

        return {
            conversationId: conversation._id,
            customer: {
                _id: customer?.user?._id || null,
                firstname: customer?.user?.firstname || "",
                lastname: customer?.user?.lastname || "",
                email: customer?.user?.email || "",
                username: customer?.user?.username || "",
                phone: customer?.user?.phone || "",
            },
            product: product._id
                ? {
                      _id: product._id,
                      name: product.name || "Product",
                      image: productImage || null,
                  }
                : null,
            lastMessage: conversation.lastMessage || null,
            lastMessageAt:
                conversation.lastMessageAt || conversation.createdAt,
            messageCount: countMap[String(conversation._id)] || 0,
            sellerUnread: me?.unreadCount || 0,
        };
    });
};

// =======================================
// Messages
// =======================================

const createMessage = async (data) => {
    return await Message.create(data);
};

const findMessageById = async (messageId) => {
    return await Message.findById(messageId);
};

const updateMessageText = async (messageId, text) => {
    return await Message.updateOne(
        { _id: messageId },
        {
            $set: {
                text,
                editedAt: new Date(),
            },
        }
    );
};

const softDeleteMessage = async (messageId) => {
    return await Message.updateOne(
        { _id: messageId },
        {
            $set: {
                text: "",
                deletedAt: new Date(),
            },
        }
    );
};

const getLatestMessage = async (conversationId) => {
    return await Message.findOne({ conversation: conversationId })
        .sort({ createdAt: -1 })
        .lean();
};

const findMessagesByConversation = async (conversationId, { before = null, limit = 30 }) => {
    const filter = { conversation: conversationId };

    if (before) {
        filter.createdAt = { $lt: before };
    }

    const messages = await Message.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return messages.reverse();
};

const markMessagesDelivered = async (conversationId, receiverUserId, { messageIds = [] } = {}) => {
    const filter = {
        conversation: conversationId,
        receiver: receiverUserId,
        deliveredAt: null,
    };

    if (messageIds.length) {
        filter._id = { $in: messageIds };
    }

    const updated = await Message.updateMany(filter, {
        $set: { deliveredAt: new Date() },
    });

    return updated.modifiedCount;
};

const findDeliveredMessageIds = async (conversationId, receiverUserId, { messageIds = [] } = {}) => {
    const filter = {
        conversation: conversationId,
        receiver: receiverUserId,
        deliveredAt: { $ne: null },
    };

    if (messageIds.length) {
        filter._id = { $in: messageIds };
    }

    const messages = await Message.find(filter).select("_id deliveredAt").lean();

    return messages;
};

const markMessagesRead = async (conversationId, receiverUserId) => {
    const readAt = new Date();

    const updated = await Message.updateMany(
        {
            conversation: conversationId,
            receiver: receiverUserId,
            readAt: null,
        },
        {
            $set: { readAt },
        }
    );

    const updatedIds = await Message.find({
        conversation: conversationId,
        receiver: receiverUserId,
        readAt,
    })
        .select("_id")
        .lean();

    return {
        readAt,
        modifiedCount: updated.modifiedCount,
        messageIds: updatedIds.map((m) => m._id),
    };
};

const markAllMessagesDeliveredForUser = async (receiverUserId) => {
    const pending = await Message.find({
        receiver: receiverUserId,
        deliveredAt: null,
    })
        .select("_id sender conversation")
        .lean();

    if (!pending.length) {
        return { updated: 0, groups: [] };
    }

    const deliveredAt = new Date();

    const updated = await Message.updateMany(
        {
            receiver: receiverUserId,
            deliveredAt: null,
        },
        {
            $set: { deliveredAt },
        }
    );

    const groupsBySenderAndConversation = {};

    for (const message of pending) {
        const key = `${String(message.sender)}|${String(message.conversation)}`;

        if (!groupsBySenderAndConversation[key]) {
            groupsBySenderAndConversation[key] = {
                sender: message.sender,
                conversationId: message.conversation,
                messageIds: [],
                deliveredAt,
            };
        }

        groupsBySenderAndConversation[key].messageIds.push(message._id);
    }

    return {
        updated: updated.modifiedCount,
        groups: Object.values(groupsBySenderAndConversation),
    };
};

module.exports = {
    findConversationBetweenUsers,
    findConversationById,
    findConversationByIdForUser,
    createConversation,
    findConversationsForUser,
    findConversationsForSeller,
    findConversationPartnerIds,
    updateConversationAfterMessage,
    incrementUnreadCount,
    resetUnreadCount,
    sumUnreadForUser,
    sumUnreadForSeller,
    findCustomersForSeller,
    createMessage,
    findMessageById,
    updateMessageText,
    softDeleteMessage,
    getLatestMessage,
    findMessagesByConversation,
    markMessagesDelivered,
    findDeliveredMessageIds,
    markMessagesRead,
    markAllMessagesDeliveredForUser,
};
