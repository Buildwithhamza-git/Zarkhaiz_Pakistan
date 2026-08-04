const notificationService = require("./notification.service");

// ==========================================
// GET /notifications
// ==========================================

const getMyNotifications = async (req, res, next) => {
    try {
        const result =
            await notificationService.getUserNotificationsService(
                req.user.userId,
                req.query
            );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// GET /notifications/unread-count
// ==========================================

const getUnreadCount = async (req, res, next) => {
    try {
        const count =
            await notificationService.getUnreadCountService(
                req.user.userId
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
// PATCH /notifications/:id/read
// ==========================================

const markNotificationRead = async (req, res, next) => {
    try {
        const notification =
            await notificationService.markReadService(
                req.params.id,
                req.user.userId
            );

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// PATCH /notifications/read-all
// ==========================================

const markAllNotificationsRead = async (req, res, next) => {
    try {
        await notificationService.markAllReadService(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
};
