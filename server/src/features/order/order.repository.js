const Order = require("./order.model");
const Product = require("../product/product.model");

const USER_POPULATE = "firstname lastname email phone";

const populateOrder = (query) =>
    query.populate("user", USER_POPULATE);

/**
 * Create an order.
 */
const createOrder = async (orderData) => {
    return await Order.create(orderData);
};

/**
 * Find a single order by id.
 */
const findOrderById = async (orderId) => {
    return await populateOrder(
        Order.findById(orderId)
    );
};

/**
 * Find a single order by id without populating (for internal ops).
 */
const findRawOrderById = async (orderId) => {
    return await Order.findById(orderId);
};

/**
 * Paginated orders for a user (newest first).
 */
const findOrdersByUser = async (userId, { page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;

    const filter = { user: userId };

    const [items, total] = await Promise.all([
        populateOrder(
            Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        ),
        Order.countDocuments(filter),
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
 * Paginated orders for an admin (optional status filter).
 */
const findAllOrders = async (
    { page = 1, limit = 10, orderStatus } = {}
) => {
    const skip = (page - 1) * limit;

    const filter = {};
    if (orderStatus) {
        filter.orderStatus = orderStatus;
    }

    const [items, total] = await Promise.all([
        populateOrder(
            Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        ),
        Order.countDocuments(filter),
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
 * Paginated orders that contain products belonging to a seller.
 */
const findOrdersBySeller = async (
    sellerId,
    { page = 1, limit = 10, orderStatus } = {}
) => {
    const skip = (page - 1) * limit;

    const filter = { "items.seller": sellerId };
    if (orderStatus) {
        filter.orderStatus = orderStatus;
    }

    const [items, total] = await Promise.all([
        populateOrder(
            Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        ),
        Order.countDocuments(filter),
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
 * Update an order's status.
 */
const updateOrderStatus = async (orderId, orderStatus) => {
    return await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true, runValidators: true }
    );
};

/**
 * Update payment status.
 */
const updatePaymentStatus = async (orderId, paymentStatus) => {
    return await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus },
        { new: true, runValidators: true }
    );
};

/**
 * Count orders matching a filter.
 */
const countOrders = async (filter = {}) => {
    return await Order.countDocuments(filter);
};

/**
 * Admin dashboard order stats.
 * Revenue only counts delivered orders.
 */
const getOrderStats = async () => {
    const [totalOrders, pendingOrders, revenueResult, recent] =
        await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ orderStatus: "pending" }),
            Order.aggregate([
                {
                    $match: { orderStatus: "delivered" },
                },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: "$totals.total" },
                    },
                },
            ]),
            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("user", USER_POPULATE),
        ]);

    return {
        totalOrders,
        pendingOrders,
        revenue: revenueResult[0]?.revenue || 0,
        recentOrders: recent,
    };
};

/**
 * Seller order stats (orders + revenue for the seller's own items only).
 * Revenue only counts delivered orders.
 */
const getSellerOrderStats = async (sellerId) => {
    const [ordersResult, revenueResult] = await Promise.all([
        Order.aggregate([
            { $match: { "items.seller": sellerId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: {
                        $sum: {
                            $cond: [
                                { $eq: ["$orderStatus", "pending"] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]),
        Order.aggregate([
            {
                $match: {
                    "items.seller": sellerId,
                    orderStatus: "delivered",
                },
            },
            {
                $unwind: "$items",
            },
            {
                $match: { "items.seller": sellerId },
            },
            {
                $group: {
                    _id: null,
                    revenue: {
                        $sum: {
                            $multiply: [
                                "$items.price",
                                "$items.quantity",
                            ],
                        },
                    },
                },
            },
        ]),
    ]);

    return {
        totalOrders: ordersResult[0]?.total || 0,
        pendingOrders: ordersResult[0]?.pending || 0,
        revenue: revenueResult[0]?.revenue || 0,
    };
};

/**
 * Seller dashboard stats (products, orders, customers, revenue).
 * Revenue only counts delivered orders.
 */
const getSellerDashboardStats = async (sellerId) => {
    const [products, ordersResult, customersResult, revenueResult] =
        await Promise.all([
            Product.countDocuments({
                seller: sellerId,
                isDeleted: { $ne: true },
            }),
            Order.aggregate([
                { $match: { "items.seller": sellerId } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        pending: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$orderStatus", "pending"] },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),
            Order.aggregate([
                { $match: { "items.seller": sellerId } },
                { $group: { _id: "$user" } },
                { $count: "customers" },
            ]),
            Order.aggregate([
                {
                    $match: {
                        "items.seller": sellerId,
                        orderStatus: "delivered",
                    },
                },
                { $unwind: "$items" },
                { $match: { "items.seller": sellerId } },
                {
                    $group: {
                        _id: null,
                        revenue: {
                            $sum: {
                                $multiply: [
                                    "$items.price",
                                    "$items.quantity",
                                ],
                            },
                        },
                    },
                },
            ]),
        ]);

    return {
        products,
        orders: ordersResult[0]?.total || 0,
        pendingOrders: ordersResult[0]?.pending || 0,
        customers: customersResult[0]?.customers || 0,
        revenue: revenueResult[0]?.revenue || 0,
    };
};

module.exports = {
    createOrder,
    findOrderById,
    findRawOrderById,
    findOrdersByUser,
    findAllOrders,
    findOrdersBySeller,
    updateOrderStatus,
    updatePaymentStatus,
    countOrders,
    getOrderStats,
    getSellerOrderStats,
    getSellerDashboardStats,
};
