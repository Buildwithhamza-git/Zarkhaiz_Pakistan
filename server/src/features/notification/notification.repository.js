const Notification = require("./notification.model");

/**
 * Create a single notification.
 */
const createNotification = async (payload) => {
    return await Notification.create(payload);
};

/**
 * Create many notifications in one call.
 */
const createNotifications = async (payloads) => {
    if (!payloads.length) {
        return [];
    }

    return await Notification.insertMany(payloads);
};

/**
 * Find notifications for a recipient (newest first, paginated).
 */
const findNotificationsForUser = async (recipientId, { page = 1, limit = 20 } = {}) => {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        Notification.find({ recipient: recipientId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Notification.countDocuments({ recipient: recipientId }),
    ]);

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

/**
 * Count unread notifications for a recipient.
 */
const countUnreadForUser = async (recipientId) => {
    return await Notification.countDocuments({
        recipient: recipientId,
        read: false,
    });
};

/**
 * Mark a single notification as read (scoped to the recipient).
 */
const markNotificationRead = async (notificationId, recipientId) => {
    return await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: recipientId,
        },
        { read: true },
        { new: true }
    );
};

/**
 * Mark all notifications as read for a recipient.
 */
const markAllNotificationsRead = async (recipientId) => {
    return await Notification.updateMany(
        {
            recipient: recipientId,
            read: false,
        },
        { read: true }
    );
};

module.exports = {
    createNotification,
    createNotifications,
    findNotificationsForUser,
    countUnreadForUser,
    markNotificationRead,
    markAllNotificationsRead,
};
