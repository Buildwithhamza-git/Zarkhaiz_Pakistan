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
        { returnDocument: "after" }
    );
};

/**
 * Count wishlist entries for a user.
 */
const countWishlistByUser = async (userId) => {
    return await Wishlist.countDocuments({ user: userId });
};

/**
 * Aggregate wishlist entries by product for a given seller.
 * Returns each product with:
 *   - users:        total number of users who added it to their wishlist
 *   - notifiedUsers:number of users who explicitly notified the seller
 *   - product:      populated product document (+ category name)
 * Sorted by notified users first, then total users, then most recent.
 */
const aggregateWishlistBySeller = async (sellerId, { page = 1, limit = 20 } = {}) => {
    const skip = (page - 1) * limit;

    const matchDeleted = { "product.isDeleted": { $ne: true } };

    const itemPipeline = [
        { $match: { seller: sellerId } },
        {
            $group: {
                _id: "$product",
                users: { $sum: 1 },
                notifiedUsers: {
                    $sum: {
                        $cond: [{ $eq: ["$notifySeller", true] }, 1, 0],
                    },
                },
                lastWishlistedAt: { $max: "$createdAt" },
            },
        },
        { $sort: { notifiedUsers: -1, users: -1, lastWishlistedAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        { $match: matchDeleted },
        {
            $lookup: {
                from: "categories",
                localField: "product.category",
                foreignField: "_id",
                as: "product.category",
            },
        },
        {
            $unwind: {
                path: "$product.category",
                preserveNullAndEmptyArrays: true,
            },
        },
    ];

    const countPipeline = [
        { $match: { seller: sellerId } },
        { $group: { _id: "$product" } },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        { $match: matchDeleted },
        { $count: "total" },
    ];

    const [items, totalRows] = await Promise.all([
        Wishlist.aggregate(itemPipeline),
        Wishlist.aggregate(countPipeline),
    ]);

    const total = totalRows.length ? totalRows[0].total : 0;

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

module.exports = {
    findWishlistByUser,
    findWishlistItem,
    createWishlistItem,
    deleteWishlistItem,
    updateNotifySeller,
    countWishlistByUser,
    aggregateWishlistBySeller,
};