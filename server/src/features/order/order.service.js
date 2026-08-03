const mongoose = require("mongoose");

const AppError = require("../../shared/utils/AppError");

const Product = require("../product/product.model");
const Seller = require("../seller/model/seller.model");

const orderRepository = require("./order.repository");
const cartRepository = require("../cart/repository/cart.repository");
const notificationService = require("../notification/notification.service");

const {
    sendOrderConfirmationEmail,
} = require("../../shared/services/email.service");

// ==========================================
// Config
// ==========================================

const DELIVERY_FEE = 199;
const FREE_DELIVERY_THRESHOLD = 2000;

const ORDER_STATUS_FLOW = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
};

// ==========================================
// Helpers
// ==========================================

const generateOrderNumber = () => {
    const now = new Date();
    const datePart = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("");

    const randomPart = String(
        Math.floor(Math.random() * 9000) + 1000
    );

    return `ZK-${datePart}-${randomPart}`;
};

const isSellerOwner = async (product, userId) => {
    if (!product.seller) {
        return false;
    }

    const seller = await Seller.findById(product.seller).select("user");

    return seller?.user?.toString() === userId.toString();
};

const getEffectiveImage = (product) => {
    const images = Array.isArray(product.images)
        ? product.images
        : [];

    const first = images[0];

    if (typeof first === "string") {
        return first;
    }

    return first?.url || "";
};

const getCartProductId = (item) => {
    if (!item?.product) {
        return null;
    }

    if (item.product._id) {
        return item.product._id.toString();
    }

    return item.product.toString();
};

// ==========================================
// Create Order
// ==========================================

const createOrderService = async (userId, payload) => {
    if (!userId) {
        throw new AppError("User ID is required.", 400);
    }

    // ==========================================
    // Load Cart
    // ==========================================

    const cart = await cartRepository.findCartByUser(userId);

    if (!cart || !cart.items.length) {
        throw new AppError("Your cart is empty.", 400);
    }

    // ==========================================
    // Snapshot Items
    // ==========================================

    const orderItems = [];

    for (const cartItem of cart.items) {
        const productId = getCartProductId(cartItem);

        if (!productId) {
            continue;
        }

        const product = await Product.findById(productId);

        if (!product) {
            throw new AppError("A product in your cart no longer exists.", 400);
        }

        // ==========================================
        // Availability
        // ==========================================

        if (
            product.status &&
            product.status.toLowerCase() !== "active"
        ) {
            throw new AppError(
                `${product.name} is no longer available.`,
                400
            );
        }

        const requestedQty = Number(cartItem.quantity || 1);
        const availableStock = Number(product.stock || 0);

        if (availableStock < requestedQty) {
            throw new AppError(
                `Only ${availableStock} units of ${product.name} are available.`,
                400
            );
        }

        // ==========================================
        // Ownership
        // ==========================================

        if (await isSellerOwner(product, userId)) {
            throw new AppError(
                "You cannot purchase your own product.",
                403
            );
        }

        // ==========================================
        // Atomic Stock Decrement
        // ==========================================

        const updated = await Product.findOneAndUpdate(
            {
                _id: product._id,
                stock: { $gte: requestedQty },
            },
            {
                $inc: { stock: -requestedQty, totalSold: requestedQty },
            },
            { new: true }
        );

        if (!updated) {
            throw new AppError(
                `${product.name} stock changed. Please review your cart.`,
                409
            );
        }

        const unitPrice = Number(product.price || 0);

        orderItems.push({
            product: product._id,
            seller: product.seller,
            name: product.name,
            price: unitPrice,
            quantity: requestedQty,
            unit: product.unit || "piece",
            image: getEffectiveImage(product),
        });
    }

    // ==========================================
    // Totals
    // ==========================================

    const subtotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const deliveryFee =
        subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

    const total = subtotal + deliveryFee;

    // ==========================================
    // Create Order
    // ==========================================

    const order = await orderRepository.createOrder({
        orderNumber: generateOrderNumber(),
        user: userId,
        items: orderItems,
        shippingAddress: payload.shippingAddress,
        totals: { subtotal, deliveryFee, total },
        paymentMethod: payload.paymentMethod || "COD",
        paymentStatus: "pending",
        orderStatus: "pending",
        notes: payload.notes || "",
    });

    // ==========================================
    // Clear Cart
    // ==========================================

    await cartRepository.deleteCartByUser(userId);

    // ==========================================
    // Notify Admin
    // ==========================================

    await notificationService.notifyAdminsOfOrderService(order);

    // ==========================================
    // Notify Sellers
    // ==========================================

    await notifySellersOfOrderEventService(order, {
        title: "New order",
        message: `You have a new order ${order.orderNumber}.`,
    });

    // ==========================================
    // Notify Buyer (order placed)
    // ==========================================

    await notifyBuyerOfOrderPlacedService(order, userId);

    // ==========================================
    // Order Confirmation Email
    // ==========================================

    try {
        const customer = await require("../users/user.model").User.findById(
            userId
        );

        if (customer?.email) {
            await sendOrderConfirmationEmail(customer.email, order);
        }
    } catch (error) {
        console.error("Order confirmation email error:", error);
    }

    return order;
};

// ==========================================
// Notify Sellers (best effort)
// ==========================================

const notifySellersOfOrderEventService = async (
    order,
    { title, message }
) => {
    try {
        const sellerIds = new Set(
            (order.items || [])
                .map((item) => item.seller?.toString())
                .filter(Boolean)
        );

        if (!sellerIds.size) {
            return;
        }

        const sellers = await Seller.find({
            _id: { $in: [...sellerIds] },
        }).select("user");

        const userRecipients = sellers
            .map((seller) => seller.user)
            .filter(Boolean);

        await notificationService.createNotificationsForUsersService(
            userRecipients,
            {
                type: "order",
                title,
                message,
                data: {
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                },
            }
        );
    } catch (error) {
        console.error("Seller order notification error:", error);
    }
};

// ==========================================
// Notify Buyer (order placed)
// ==========================================

const notifyBuyerOfOrderPlacedService = async (order, userId) => {
    try {
        await notificationService.createNotificationsForUsersService(
            [userId],
            {
                type: "order_status",
                title: "Order placed",
                message: `Your order ${order.orderNumber} has been placed successfully.`,
                data: {
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    status: "pending",
                },
            }
        );
    } catch (error) {
        console.error("Buyer order placed notification error:", error);
    }
};

// ==========================================
// My Orders
// ==========================================

const getMyOrdersService = async (userId, query = {}) => {
    return await orderRepository.findOrdersByUser(userId, {
        page: query.page,
        limit: query.limit,
    });
};

// ==========================================
// Order Detail
// ==========================================

const getOrderDetailService = async (orderId, user) => {
    const order = await orderRepository.findOrderById(orderId);

    if (!order) {
        throw new AppError("Order not found.", 404);
    }

    const isOwner = order.user?._id?.toString() === user.userId.toString();
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
        throw new AppError("You do not have access to this order.", 403);
    }

    return order;
};

// ==========================================
// Cancel Order
// ==========================================

const cancelOrderService = async (userId, orderId) => {
    const order = await orderRepository.findRawOrderById(orderId);

    if (!order) {
        throw new AppError("Order not found.", 404);
    }

    if (order.user.toString() !== userId.toString()) {
        throw new AppError("You do not have access to this order.", 403);
    }

    if (order.orderStatus !== "pending") {
        throw new AppError(
            "Only pending orders can be cancelled.",
            400
        );
    }

    await restoreStock(order);

    const updated = await orderRepository.updateOrderStatus(
        orderId,
        "cancelled"
    );

    await notificationService.notifyOrderStatusService(updated, "cancelled");

    await notifySellersOfOrderEventService(updated, {
        title: "Order cancelled",
        message: `Order ${updated.orderNumber} was cancelled by the customer.`,
    });

    return updated;
};

// ==========================================
// Restore Stock (on cancel)
// ==========================================

const restoreStock = async (order) => {
    for (const item of order.items) {
        await Product.updateOne(
            { _id: item.product },
            {
                $inc: {
                    stock: item.quantity,
                    totalSold: -item.quantity,
                },
            }
        );
    }
};

// ==========================================
// Admin: List All Orders
// ==========================================

const listAllOrdersService = async (query = {}) => {
    return await orderRepository.findAllOrders({
        page: query.page,
        limit: query.limit,
        orderStatus: query.orderStatus,
    });
};

// ==========================================
// Admin: Update Order Status
// ==========================================

const updateOrderStatusService = async (orderId, newStatus) => {
    const order = await orderRepository.findRawOrderById(orderId);

    if (!order) {
        throw new AppError("Order not found.", 404);
    }

    const allowed = ORDER_STATUS_FLOW[order.orderStatus] || [];

    if (!allowed.includes(newStatus)) {
        throw new AppError(
            `Order cannot transition from ${order.orderStatus} to ${newStatus}.`,
            400
        );
    }

    if (newStatus === "cancelled") {
        await restoreStock(order);
    }

    let updated = await orderRepository.updateOrderStatus(
        orderId,
        newStatus
    );

    // COD is paid on delivery.
    if (newStatus === "delivered") {
        const paidOrder = await orderRepository.updatePaymentStatus(
            orderId,
            "paid"
        );

        if (paidOrder) {
            updated = paidOrder;
        }
    }

    await notificationService.notifyOrderStatusService(updated, newStatus);

    return updated;
};

// ==========================================
// Seller: List Orders For Their Products
// ==========================================

const listSellerOrdersService = async (sellerId, query = {}) => {
    return await orderRepository.findOrdersBySeller(sellerId, {
        page: query.page,
        limit: query.limit,
        orderStatus: query.orderStatus,
    });
};

// ==========================================
// Seller: Update Order Status (own products only)
// ==========================================

const updateSellerOrderStatusService = async (userId, orderId, newStatus) => {
    const seller = await resolveSellerForUserService(userId);

    const order = await orderRepository.findRawOrderById(orderId);

    if (!order) {
        throw new AppError("Order not found.", 404);
    }

    const sellerId = seller._id.toString();

    const hasSellerItem = (order.items || []).some(
        (item) => item.seller?.toString() === sellerId
    );

    if (!hasSellerItem) {
        throw new AppError(
            "This order does not contain your products.",
            403
        );
    }

    const allItemsMine = (order.items || []).every(
        (item) => item.seller?.toString() === sellerId
    );

    if (!allItemsMine) {
        throw new AppError(
            "This order contains products from other sellers and cannot be updated by you.",
            403
        );
    }

    const allowed = ORDER_STATUS_FLOW[order.orderStatus] || [];

    if (!allowed.includes(newStatus)) {
        throw new AppError(
            `Order cannot transition from ${order.orderStatus} to ${newStatus}.`,
            400
        );
    }

    if (newStatus === "cancelled") {
        await restoreStock(order);
    }

    let updated = await orderRepository.updateOrderStatus(
        orderId,
        newStatus
    );

    // COD is paid on delivery.
    if (newStatus === "delivered") {
        const paidOrder = await orderRepository.updatePaymentStatus(
            orderId,
            "paid"
        );

        if (paidOrder) {
            updated = paidOrder;
        }
    }

    await notificationService.notifyOrderStatusService(updated, newStatus);

    return updated;
};

// ==========================================
// Resolve Seller For Current User
// ==========================================

const resolveSellerForUserService = async (userId) => {
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
        throw new AppError("Seller profile not found.", 404);
    }

    return seller;
};

// ==========================================
// Admin: Order Stats
// ==========================================

const getOrderStatsService = async () => {
    return await orderRepository.getOrderStats();
};

// ==========================================
// Seller: Order Stats
// ==========================================

const getSellerOrderStatsService = async (sellerId) => {
    return await orderRepository.getSellerOrderStats(sellerId);
};

module.exports = {
    createOrderService,
    getMyOrdersService,
    getOrderDetailService,
    cancelOrderService,
    listAllOrdersService,
    updateOrderStatusService,
    listSellerOrdersService,
    updateSellerOrderStatusService,
    resolveSellerForUserService,
    getOrderStatsService,
    getSellerOrderStatsService,
};
