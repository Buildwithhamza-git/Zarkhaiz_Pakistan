const Order = require("../../order/order.model");

/**
 * Find a delivered order containing a product for a user.
 * Only delivered orders count as a verified purchase.
 */
const findPurchasedOrder = async (userId, productId) => {
    return await Order.findOne({
        user: userId,
        "items.product": productId,
        orderStatus: "delivered",
    });
};

/**
 * Find a delivered order containing a product, along with the
 * specific order item the user purchased (so the review can
 * reference the exact purchased item via its _id).
 */
const findPurchasedOrderItem = async (userId, productId) => {
    const order = await Order.findOne({
        user: userId,
        "items.product": productId,
        orderStatus: "delivered",
    }).lean();

    if (!order) {
        return { order: null, item: null };
    }

    const productIdStr = productId.toString();

    const item =
        order.items &&
        order.items.find(
            (entry) =>
                entry.product &&
                entry.product.toString() === productIdStr
        );

    return {
        order: order._id,
        item: item ? item : null,
    };
};

/**
 * Check whether a user can review a product.
 * Returns { eligible, order, message }.
 */
const checkReviewEligibility = async (userId, productId) => {
    const order = await findPurchasedOrder(userId, productId);

    if (!order) {
        return {
            eligible: false,
            order: null,
            message:
                "You can only review a product after your order has been delivered.",
        };
    }

    return {
        eligible: true,
        order,
        message: "",
    };
};

module.exports = {
    findPurchasedOrder,
    findPurchasedOrderItem,
    checkReviewEligibility,
};
