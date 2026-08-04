const Wishlist = require("../model/wishlist.model");

/**
 * Find all wishlist entries for a user, newest first,
 * with product (+ category, seller, seller's user) populated.
 */
const findWishlistByUser = async (userId) => {
    return await Wishlist.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate({
            path: "product",
            populate: [
                { path: "category", select: "name" },
                {
                    path: "seller",
                    select: "user storeName city province",
                    populate: {
                        path: "user",
                        select: "firstname lastname email",
                    },
                },
            ],
        });
};

/**
 * Find a single wishlist entry for a user + product.
 */
const findWishlistItem = async (userId, productId) => {
    return await Wishlist.findOne({
        user: userId,
        product: productId,
    });
};

/**
 * Create a new wishlist entry.
 */
const createWishlistItem = async (payload) => {
    return await Wishlist.create(payload);
};

/**
 * Delete a wishlist entry (scoped to the user).
 */
const deleteWishlistItem = async (userId, productId) => {
    return await Wishlist.findOneAndDelete({
        user: userId,
        product: productId,
    });
};

/**
 * Update the notifySeller flag on an existing wishlist entry.
 */
const updateNotifySeller = async (userId, productId, notifySeller) => {
    return await Wishlist.findOneAndUpdate(
        { user: userId, product: productId },
        { notifySeller },
        { new: true }
    );
};

/**
 * Count wishlist entries for a user.
 */
const countWishlistByUser = async (userId) => {
    return await Wishlist.countDocuments({ user: userId });
};

module.exports = {
    findWishlistByUser,
    findWishlistItem,
    createWishlistItem,
    deleteWishlistItem,
    updateNotifySeller,
    countWishlistByUser,
};