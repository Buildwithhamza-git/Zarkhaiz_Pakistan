const orderService = require("./order.service");

// ==========================================
// POST /orders
// ==========================================

const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrderService(
            req.user.userId,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// GET /orders/mine
// ==========================================

const getMyOrders = async (req, res, next) => {
    try {
        const result = await orderService.getMyOrdersService(
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
// GET /orders/:id
// ==========================================

const getOrderDetail = async (req, res, next) => {
    try {
        const order = await orderService.getOrderDetailService(
            req.params.id,
            req.user
        );

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// POST /orders/:id/cancel
// ==========================================

const cancelOrder = async (req, res, next) => {
    try {
        const order = await orderService.cancelOrderService(
            req.user.userId,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully.",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// GET /orders (admin)
// ==========================================

const listAllOrders = async (req, res, next) => {
    try {
        const result = await orderService.listAllOrdersService(req.query);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// PATCH /orders/:id/status (admin)
// ==========================================

const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderStatusService(
            req.params.id,
            req.body.status
        );

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully.",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// PATCH /orders/seller/:id/status (seller)
// ==========================================

const updateSellerOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateSellerOrderStatusService(
            req.user.userId,
            req.params.id,
            req.body.status
        );

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully.",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// GET /orders/seller (seller)
// ==========================================

const getSellerOrders = async (req, res, next) => {
    try {
        const seller =
            await orderService.resolveSellerForUserService(
                req.user.userId
            );

        const result = await orderService.listSellerOrdersService(
            seller._id,
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
// GET /orders/stats (admin)
// ==========================================

const getOrderStats = async (req, res, next) => {
    try {
        const stats = await orderService.getOrderStatsService();

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// GET /orders/seller/stats (seller)
// ==========================================

const getSellerOrderStats = async (req, res, next) => {
    try {
        const seller =
            await orderService.resolveSellerForUserService(
                req.user.userId
            );

        const stats = await orderService.getSellerOrderStatsService(
            seller._id
        );

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
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
};
