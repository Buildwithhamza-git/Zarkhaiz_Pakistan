const mongoose = require("mongoose");

const Review = require("../model/review.model");
const User = require("../../users/user.model");
const Order = require("../../order/order.model");

// Mongoose does not cast values inside aggregate $match stages,
// so coerce id strings to ObjectIds before passing them to aggregates.
const asObjectId = (id) =>
    mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id;

const USER_POPULATE = "firstname lastname email";

const PRODUCT_POPULATE = "name slug images";

const SELLER_POPULATE = "storeName";

const reviewBaseQuery = (query) =>
    query
        .populate("user", USER_POPULATE)
        .populate("product", PRODUCT_POPULATE)
        .populate("seller", SELLER_POPULATE);

// ==========================================
// Sort Mapping
// ==========================================

const SORTS = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    highest: { rating: -1, createdAt: -1 },
    lowest: { rating: 1, createdAt: -1 },
    helpful: { helpfulCount: -1, createdAt: -1 },
};

const getSort = (sort) => SORTS[sort] || SORTS.newest;

// ==========================================
// Filter Helpers
// ==========================================

const escapeRegex = (value) =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSearchFilter = async (search) => {
    if (!search) return {};

    const regex = new RegExp(escapeRegex(search), "i");

    const matchingUsers = await User.find({
        $or: [{ firstname: regex }, { lastname: regex }],
    }).select("_id");

    const userIds = matchingUsers.map((user) => user._id);

    return {
        $or: [
            { title: regex },
            { description: regex },
            ...(userIds.length ? [{ user: { $in: userIds } }] : []),
        ],
    };
};

// ==========================================
// Public / Product Reviews
// ==========================================

const findReviewsByProduct = async (
    productId,
    {
        page = 1,
        limit = 10,
        sort = "newest",
        rating,
        search,
        withImages,
        verified,
    } = {}
) => {
    const skip = (page - 1) * limit;

    const filter = { product: productId, status: "approved" };

    if (rating) {
        filter.rating = Number(rating);
    }

    if (withImages === "true" || withImages === true) {
        filter["images.0"] = { $exists: true };
    }

    if (verified === "true" || verified === true) {
        filter.isVerifiedPurchase = true;
    }

    if (search) {
        Object.assign(filter, await buildSearchFilter(search));
    }

    const [items, total] = await Promise.all([
        reviewBaseQuery(
            Review.find(filter)
                .sort(getSort(sort))
                .skip(skip)
                .limit(limit)
        ),
        Review.countDocuments(filter),
    ]);

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

// ==========================================
// Product Rating Stats
// ==========================================

const getProductRatingStats = async (productId) => {
    const [rows] = await Promise.all([
        Review.aggregate([
            { $match: { product: asObjectId(productId), status: "approved" } },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 },
                },
            },
        ]),
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalReviews = 0;
    let sum = 0;

    for (const row of rows) {
        distribution[row._id] = row.count;
        totalReviews += row.count;
        sum += row._id * row.count;
    }

    return {
        averageRating: totalReviews ? Math.round((sum / totalReviews) * 10) / 10 : 0,
        totalReviews,
        distribution,
    };
};

// ==========================================
// Customer Photo Gallery
// ==========================================

const getCustomerPhotos = async (productId) => {
    return await Review.aggregate([
        {
            $match: {
                product: asObjectId(productId),
                status: "approved",
                images: { $exists: true, $ne: [] },
            },
        },
        { $unwind: "$images" },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userInfo",
            },
        },
        {
            $project: {
                _id: 0,
                image: "$images",
                name: {
                    $concat: [
                        { $arrayElemAt: ["$userInfo.firstname", 0] },
                        " ",
                        { $arrayElemAt: ["$userInfo.lastname", 0] },
                    ],
                },
            },
        },
        { $limit: 40 },
    ]);
};

// ==========================================
// CRUD
// ==========================================

const createReview = async (payload) => {
    return await Review.create(payload);
};

// ==========================================
// Order Reviewed Tracking
// ==========================================

const markOrderItemReviewed = async (orderId, orderItemId, reviewId) => {
    if (!orderId || !orderItemId || !reviewId) return null;

    return await Order.updateOne(
        { _id: orderId, "items._id": orderItemId },
        {
            $set: {
                "items.$.reviewed": true,
                "items.$.reviewId": reviewId,
            },
        }
    );
};

const unmarkOrderItemReviewed = async (orderId, orderItemId) => {
    if (!orderId || !orderItemId) return null;

    return await Order.updateOne(
        { _id: orderId, "items._id": orderItemId },
        {
            $set: {
                "items.$.reviewed": false,
                "items.$.reviewId": null,
            },
        }
    );
};

const findReviewById = async (reviewId) => {
    return await reviewBaseQuery(Review.findById(reviewId));
};

const findReviewByUserAndProduct = async (userId, productId) => {
    return await Review.findOne({ user: userId, product: productId });
};

const updateReview = async (reviewId, userId, updateData) => {
    return await reviewBaseQuery(
        Review.findOneAndUpdate(
            { _id: reviewId, user: userId },
            updateData,
            { returnDocument: "after", runValidators: true }
        )
    );
};

const deleteReview = async (reviewId, userId) => {
    return await Review.findOneAndDelete({ _id: reviewId, user: userId });
};

// ==========================================
// Helpful / Report
// ==========================================

const toggleHelpful = async (reviewId, userId) => {
    const review = await Review.findOne({ _id: reviewId });

    if (!review) return null;

    const userIdStr = userId.toString();

    const alreadyHelpful = (review.helpfulUsers || []).some(
        (id) => id.toString() === userIdStr
    );

    if (alreadyHelpful) {
        review.helpfulUsers = review.helpfulUsers.filter(
            (id) => id.toString() !== userIdStr
        );
        review.helpfulCount = Math.max(0, (review.helpfulCount || 0) - 1);
    } else {
        review.helpfulUsers.push(userId);
        review.helpfulCount = (review.helpfulCount || 0) + 1;
    }

    await review.save();

    return review;
};

const reportReview = async (reviewId, userId, reason = "") => {
    const review = await Review.findOne({ _id: reviewId });

    if (!review) return null;

    const userIdStr = userId.toString();

    if (!(review.reportUsers || []).some((id) => id.toString() === userIdStr)) {
        review.reportUsers.push(userId);

        if (reason) {
            review.reportReason = reason;
        }

        await review.save();
    }

    return review;
};

// ==========================================
// My Reviews
// ==========================================

const findReviewsByUser = async (
    userId,
    { page = 1, limit = 10 } = {}
) => {
    const skip = (page - 1) * limit;

    const filter = { user: userId };

    const [items, total] = await Promise.all([
        reviewBaseQuery(
            Review.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ),
        Review.countDocuments(filter),
    ]);

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

// ==========================================
// Seller: Reviews With Filters
// ==========================================

const findReviewsBySeller = async (
    sellerId,
    {
        page = 1,
        limit = 10,
        sort = "newest",
        search,
        rating,
        productId,
        withImages,
        replied,
    } = {}
) => {
    const skip = (page - 1) * limit;

    const filter = { seller: sellerId };

    if (rating) {
        filter.rating = Number(rating);
    }

    if (productId) {
        filter.product = productId;
    }

    if (withImages === "true" || withImages === true) {
        filter["images.0"] = { $exists: true };
    }

    if (replied === "true" || replied === true) {
        filter.sellerReply = { $ne: "" };
    }

    if (replied === "false" || replied === false) {
        filter.sellerReply = { $in: ["", null] };
    }

    if (search) {
        Object.assign(filter, await buildSearchFilter(search));
    }

    const [items, total] = await Promise.all([
        reviewBaseQuery(
            Review.find(filter)
                .sort(getSort(sort))
                .skip(skip)
                .limit(limit)
        ),
        Review.countDocuments(filter),
    ]);

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

// ==========================================
// Seller: Products For Filter Dropdown
// ==========================================

const getSellerProductsForFilter = async (sellerId) => {
    return await Review.aggregate([
        { $match: { seller: asObjectId(sellerId) } },
        {
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "productInfo",
            },
        },
        {
            $project: {
                _id: { $arrayElemAt: ["$productInfo._id", 0] },
                name: { $arrayElemAt: ["$productInfo.name", 0] },
            },
        },
        { $match: { _id: { $ne: null } } },
        { $group: { _id: "$_id", name: { $first: "$name" } } },
        { $sort: { name: 1 } },
    ]);
};

// ==========================================
// Seller: Analytics
// ==========================================

const getSellerReviewStats = async (sellerId) => {
    const [rows] = await Promise.all([
        Review.aggregate([
            { $match: { seller: asObjectId(sellerId) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    average: { $avg: "$rating" },
                    positive: {
                        $sum: { $cond: [{ $gte: ["$rating", 4] }, 1, 0] },
                    },
                    negative: {
                        $sum: { $cond: [{ $lte: ["$rating", 2] }, 1, 0] },
                    },
                    pendingReplies: {
                        $sum: {
                            $cond: [
                                {
                                    $or: [
                                        { $eq: ["$sellerReply", ""] },
                                        { $eq: ["$sellerReply", null] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    newest: { $max: "$createdAt" },
                },
            },
        ]),
    ]);

    const stats = rows[0] || {};

    const total = stats.total || 0;
    const positive = stats.positive || 0;
    const negative = stats.negative || 0;

    return {
        averageRating: total ? Math.round(stats.average * 10) / 10 : 0,
        totalReviews: total,
        positiveReviews: positive,
        negativeReviews: negative,
        pendingReplies: stats.pendingReplies || 0,
        positivePercent: total ? Math.round((positive / total) * 100) : 0,
        negativePercent: total ? Math.round((negative / total) * 100) : 0,
        newestReviewAt: stats.newest || null,
    };
};

const getSellerRatingDistribution = async (sellerId) => {
    const rows = await Review.aggregate([
        { $match: { seller: asObjectId(sellerId) } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const row of rows) {
        distribution[row._id] = row.count;
    }

    return distribution;
};

const getSellerMonthlyReviews = async (sellerId, months = 6) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (months - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const rows = await Review.aggregate([
        {
            $match: {
                seller: asObjectId(sellerId),
                createdAt: { $gte: startDate },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthsArray = [];

    for (let i = 0; i < months; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);

        const label = date.toLocaleString("en-GB", {
            month: "short",
        });

        const match = rows.find(
            (row) =>
                row._id.year === date.getFullYear() &&
                row._id.month === date.getMonth() + 1
        );

        monthsArray.push({
            label,
            count: match ? match.count : 0,
        });
    }

    return monthsArray;
};

const getTopRatedProducts = async (sellerId, limit = 5) => {
    return await Review.aggregate([
        { $match: { seller: asObjectId(sellerId) } },
        {
            $group: {
                _id: "$product",
                average: { $avg: "$rating" },
                total: { $sum: 1 },
            },
        },
        { $sort: { average: -1, total: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $project: {
                name: { $arrayElemAt: ["$product.name", 0] },
                image: { $arrayElemAt: ["$product.images.0.url", 0] },
                average: { $round: ["$average", 1] },
                total: 1,
            },
        },
    ]);
};

const getLowestRatedProducts = async (sellerId, limit = 5) => {
    return await Review.aggregate([
        { $match: { seller: asObjectId(sellerId) } },
        {
            $group: {
                _id: "$product",
                average: { $avg: "$rating" },
                total: { $sum: 1 },
            },
        },
        { $sort: { average: 1, total: 1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $project: {
                name: { $arrayElemAt: ["$product.name", 0] },
                image: { $arrayElemAt: ["$product.images.0.url", 0] },
                average: { $round: ["$average", 1] },
                total: 1,
            },
        },
    ]);
};

// ==========================================
// Seller: Reply
// ==========================================

const findReviewForSellerReply = async (reviewId, sellerId) => {
    return await Review.findOne({ _id: reviewId, seller: sellerId });
};

const updateSellerReply = async (reviewId, reply) => {
    return await Review.findByIdAndUpdate(
        reviewId,
        { sellerReply: reply, sellerRepliedAt: new Date() },
        { returnDocument: "after", runValidators: true }
    );
};

// ==========================================
// Admin: Moderation
// ==========================================

const findAllReviews = async (
    { page = 1, limit = 10, status, search, sort = "newest" } = {}
) => {
    const skip = (page - 1) * limit;

    const filter = {};

    if (status && status !== "all") {
        filter.status = status;
    }

    if (search) {
        Object.assign(filter, await buildSearchFilter(search));
    }

    const [items, total] = await Promise.all([
        reviewBaseQuery(
            Review.find(filter)
                .sort(getSort(sort))
                .skip(skip)
                .limit(limit)
        ),
        Review.countDocuments(filter),
    ]);

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

const findReportedReviews = async ({ page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;

    const filter = { "reportUsers.0": { $exists: true } };

    const [items, total] = await Promise.all([
        reviewBaseQuery(
            Review.find(filter)
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
        ),
        Review.countDocuments(filter),
    ]);

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

// ==========================================
// Admin: Moderation Analytics
// ==========================================

const getAdminReviewStats = async () => {
    const [rows] = await Promise.all([
        Review.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    average: { $avg: "$rating" },
                    pending: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                    },
                    approved: {
                        $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
                    },
                    hidden: {
                        $sum: { $cond: [{ $eq: ["$status", "hidden"] }, 1, 0] },
                    },
                    rejected: {
                        $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
                    },
                    reported: {
                        $sum: {
                            $cond: [
                                {
                                    $ne: [
                                        { $size: { $ifNull: ["$reportUsers", []] } },
                                        0,
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]),
    ]);

    const stats = rows[0] || {};

    return {
        total: stats.total || 0,
        averageRating: stats.total
            ? Math.round(stats.average * 10) / 10
            : 0,
        pending: stats.pending || 0,
        approved: stats.approved || 0,
        hidden: stats.hidden || 0,
        rejected: stats.rejected || 0,
        reported: stats.reported || 0,
    };
};

const updateReviewStatus = async (reviewId, status) => {
    return await Review.findByIdAndUpdate(
        reviewId,
        { status },
        { returnDocument: "after", runValidators: true }
    );
};

const deleteReviewById = async (reviewId) => {
    return await Review.findByIdAndDelete(reviewId);
};

// ==========================================
// Generic Count (used by recalc helper)
// ==========================================

const countProductApproved = async (productId) => {
    return await Review.countDocuments({
        product: productId,
        status: "approved",
    });
};

const aggregateProductApprovedRatings = async (productId) => {
    return await Review.aggregate([
        { $match: { product: asObjectId(productId), status: "approved" } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);
};

module.exports = {
    findReviewsByProduct,
    getProductRatingStats,
    getCustomerPhotos,
    createReview,
    markOrderItemReviewed,
    unmarkOrderItemReviewed,
    findReviewById,
    findReviewByUserAndProduct,
    updateReview,
    deleteReview,
    toggleHelpful,
    reportReview,
    findReviewsByUser,
    findReviewsBySeller,
    getSellerProductsForFilter,
    getSellerReviewStats,
    getSellerRatingDistribution,
    getSellerMonthlyReviews,
    getTopRatedProducts,
    getLowestRatedProducts,
    findReviewForSellerReply,
    updateSellerReply,
    findAllReviews,
    findReportedReviews,
    getAdminReviewStats,
    updateReviewStatus,
    deleteReviewById,
    countProductApproved,
    aggregateProductApprovedRatings,
};
