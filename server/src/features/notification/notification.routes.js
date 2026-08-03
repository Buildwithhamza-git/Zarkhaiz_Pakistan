const router = require("express").Router();

const authenticate = require("../../middlewares/authenticate");

const {
    getMyNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
} = require("./notification.controller");

// List my notifications
router.get("/", authenticate, getMyNotifications);

// Unread count
router.get("/unread-count", authenticate, getUnreadCount);

// Mark one notification as read
router.patch("/:id/read", authenticate, markNotificationRead);

// Mark all notifications as read
router.patch("/read-all", authenticate, markAllNotificationsRead);

module.exports = router;
