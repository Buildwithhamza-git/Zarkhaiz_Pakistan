const { User } = require("../users/user.model");

const notificationRepository = require("./notification.repository");

const {
    emitToUser,
    emitToUsers,
} = require("../../socket");

const {
    sendAdminOrderNotificationEmail,
    sendOrderStatusEmail,
} = require("../../shared/services/email.service");

/**
 * List notifications for the current user.
 */
const getUserNotificationsService = async (userId, query = {}) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));

    return await notificationRepository.findNotificationsForUser(userId, {
        page,
        limit,
    });
};

/**
 * Unread notification count for the current user.
 */
const getUnreadCountService = async (userId) => {
    return await notificationRepository.countUnreadForUser(userId);
};

/**
 * Mark a single notification as read.
 */
const markReadService = async (notificationId, userId) => {
    const notification =
        await notificationRepository.markNotificationRead(
            notificationId,
            userId
        );

    if (!notification) {
        const AppError = require("../../shared/utils/AppError");
        throw new AppError("Notification not found.", 404);
    }

    return notification;
};

/**
 * Mark all notifications as read.
 */
const markAllReadService = async (userId) => {
    return await notificationRepository.markAllNotificationsRead(userId);
};

/**
 * Create the same notification for many recipients.
 */
const createNotificationsForUsersService = async (
    recipientIds,
    { type, title, message, data = {} }
) => {
    if (!recipientIds.length) {
        return [];
    }

    const payloads = recipientIds.map((recipient) => ({
        recipient,
        type,
        title,
        message,
        data,
    }));

    const notifications =
        await notificationRepository.createNotifications(payloads);

    emitToUsers(recipientIds, "notification:new", {
        notifications,
        recipientIds,
    });

    return notifications;
};

/**
 * Find all admin user ids.
 */
const findAdminUserIdsService = async () => {
    const admins = await User.find({ role: "admin" }).select("_id email");

    return admins;
};

/**
 * Notify admins about a newly placed order (in-app + email).
 */
const notifyAdminsOfOrderService = async (order) => {
    try {
        const admins = await findAdminUserIdsService();

        await createNotificationsForUsersService(
            admins.map((admin) => admin._id),
            {
                type: "order",
                title: "New order received",
                message: `A new order ${order.orderNumber} for Rs. ${order.totals.total.toLocaleString()} has been placed.`,
                data: {
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                },
            }
        );

        for (const admin of admins) {
            await sendAdminOrderNotificationEmail(admin.email, order);
        }

        if (!admins.length) {
            console.warn(
                "No admin users found to notify about order " +
                    order.orderNumber
            );
        }
    } catch (error) {
        console.error("Admin order notification error:", error);
    }
};

/**
 * Notify the order owner about an order status change (in-app + email).
 */
const notifyOrderStatusService = async (order, newStatus) => {
    try {
        const notification =
            await notificationRepository.createNotification({
                recipient: order.user,
                type: "order_status",
                title: "Order status updated",
                message: `Your order ${order.orderNumber} is now ${newStatus}.`,
                data: {
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    status: newStatus,
                },
            });

        emitToUser(order.user, "notification:new", {
            notifications: [notification],
        });

        await sendOrderStatusEmail(order, newStatus);
    } catch (error) {
        console.error("Order status notification error:", error);
    }
};

module.exports = {
    getUserNotificationsService,
    getUnreadCountService,
    markReadService,
    markAllReadService,
    createNotificationsForUsersService,
    findAdminUserIdsService,
    notifyAdminsOfOrderService,
    notifyOrderStatusService,
};
