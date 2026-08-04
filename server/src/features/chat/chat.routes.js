const router = require("express").Router();

const authenticate = require("../../middlewares/authenticate");
const validateRequest = require("../../middlewares/validateRequest");

const {
    startConversationSchema,
    createMessageSchema,
} = require("./chat.validation");

const {
    listConversations,
    getUnreadTotal,
    getCustomers,
    startConversation,
    getConversation,
    getMessages,
    createMessage,
    markConversationRead,
} = require("./chat.controller");

// List my conversations
router.get("/conversations", authenticate, listConversations);

// Total unread count (must be before /:id)
router.get("/conversations/unread-count", authenticate, getUnreadTotal);

// Unique buyers for the authenticated seller
router.get("/customers", authenticate, getCustomers);

// Start / find a conversation
router.post(
    "/conversations",
    authenticate,
    validateRequest(startConversationSchema),
    startConversation
);

// Single conversation
router.get("/conversations/:id", authenticate, getConversation);

// Messages in a conversation
router.get("/conversations/:id/messages", authenticate, getMessages);

// Send a message (REST fallback when socket is unavailable)
router.post(
    "/conversations/:id/messages",
    authenticate,
    validateRequest(createMessageSchema),
    createMessage
);

// Mark a conversation as read
router.post("/conversations/:id/read", authenticate, markConversationRead);

module.exports = router;
