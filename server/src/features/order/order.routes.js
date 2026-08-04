const router = require("express").Router();

const authenticate = require("../../middlewares/authenticate");
const requireAdmin = require("../../middlewares/requireAdmin");
const validateRequest = require("../../middlewares/validateRequest");

const {
    createOrderSchema,
    updateOrderStatusSchema,
} = require("./order.validation");

const {
    createOrder,
    getMyOrders,
    getOrderDetail,
    cancelOrder,
    listAllOrders,
    updateOrderStatus,
    getSellerOrders,
    updateSellerOrderStatus,
    getOrderStats,
    getSellerOrderStats,
} = require("./order.controller");

// Place an order from the current cart
router.post(
    "/",
    authenticate,
    validateRequest(createOrderSchema),
    createOrder
);

// Current user's orders
router.get("/mine", authenticate, getMyOrders);

// Admin order stats
router.get("/stats", authenticate, requireAdmin, getOrderStats);

// Seller order stats
router.get("/seller/stats", authenticate, getSellerOrderStats);

// Seller's orders
router.get("/seller", authenticate, getSellerOrders);

// Seller: update status of an order (single-seller orders only)
router.patch(
    "/seller/:id/status",
    authenticate,
    validateRequest(updateOrderStatusSchema),
    updateSellerOrderStatus
);

// Admin: list all orders
router.get("/", authenticate, requireAdmin, listAllOrders);

// Order detail (owner or admin)
router.get("/:id", authenticate, getOrderDetail);

// Cancel own order
router.post("/:id/cancel", authenticate, cancelOrder);

// Admin: update order status
router.patch(
    "/:id/status",
    authenticate,
    requireAdmin,
    validateRequest(updateOrderStatusSchema),
    updateOrderStatus
);

module.exports = router;
