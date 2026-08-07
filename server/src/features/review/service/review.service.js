const mongoose = require("mongoose");

const AppError = require("../../../shared/utils/AppError");

const Product = require("../../product/product.model");
const Seller = require("../../seller/model/seller.model");

const reviewRepository = require("../repository/review.repository");

const {
    findPurchasedOrderItem,
} = require("../helpers/reviewEligibility");
const recalculateProductRating = require("../helpers/updateProductRating");
const notifySellerOfReview = require("../helpers/reviewNotification");

// ==========================================
// Constants
// ==========================================

const EDIT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ==========================================
// Helpers
// ==========================================

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getPagination = (query) => ({
    page: Math.max(1, Number(query.page) || 1),
    limit: Math.min(50, Math.max(1, Number(query.limit) || 10)),
});

const getSellerByUserId = async (userId) => {
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
        throw new AppError("Seller profile not found.", 404);
    }

    return seller;
};

// ==========================================
// Public: Reviews For A Product
// ==========================================

const getProductReviewsService = async (productId, query = {}) => {
    if (!isValidId(productId)) {
        throw new AppError("Invalid product ID.", 400);
    }

    const { page, limit } = getPagination(query);

    const [reviews, stats] = await Promise.all([
        reviewRepository.findReviewsByProduct(productId, {
            page,
            limit,
            sort: query.sort,
            rating: query.rating,
            search: query.search,
            withImages: query.withImages,
            verified: query.verified,
        }),
        reviewRepository.getProductRatingStats(productId),
    ]);

    return {
        items: reviews.items,
        pagination: {
            page: reviews.page,
            limit: reviews.limit,
            total: reviews.total,
            totalPages: reviews.totalPages,
        },
        stats,
    };
};

// ==========================================
// Public: Product Review Summary + Photo Gallery
// ==========================================

const getProductReviewSummaryService = async (productId) => {
    if (!isValidId(productId)) {
        throw new AppError("Invalid product ID.", 400);
    }

    const [stats, photos] = await Promise.all([
        reviewRepository.getProductRatingStats(productId),
        reviewRepository.getCustomerPhotos(productId),
    ]);

    return {
        stats,
        photos,
    };
};

// ==========================================
// Create Review
// ==========================================

const createReviewService = async (userId, payload) => {
    if (!userId) {
        throw new AppError("User ID is required.", 400);
    }

    const productId = payload.productId;

    if (!isValidId(productId)) {
        throw new AppError("Invalid product ID.", 400);
    }

    // ==========================================
    // Find Product
    // ==========================================

    const product = await Product.findById(productId);

    if (!product) {
        throw new AppError("Product not found.", 404);
    }

    // ==========================================
    // Find Seller
    // ==========================================

    const seller = await Seller.findById(product.seller).select("user");

    if (!seller) {
        throw new AppError("Seller not found for this product.", 404);
    }

    // ==========================================
    // Seller Cannot Review Own Product
    // ==========================================

    if (seller.user && seller.user.toString() === userId.toString()) {
        throw new AppError("You cannot review your own product.", 403);
    }

    // ==========================================
    // Prevent Duplicate Reviews
    // ==========================================

    const existing = await reviewRepository.findReviewByUserAndProduct(
        userId,
        productId
    );

    if (existing) {
        throw new AppError("You have already reviewed this product.", 409);
    }

    // ==========================================
    // Verified Purchase Check
    // ==========================================

    const { order, item } = await findPurchasedOrderItem(userId, productId);

    if (!order) {
        throw new AppError(
            "You can only review a product after your order has been delivered.",
            403
        );
    }

    // ==========================================
    // Create Review
    // ==========================================

    const review = await reviewRepository.createReview({
        user: userId,
        product: productId,
        seller: seller._id,
        order,
        orderItem: item?._id || null,
        rating: payload.rating,
        title: payload.title || "",
        description: payload.description,
        images: payload.images || [],
        isVerifiedPurchase: true,
        status: "approved",
    });

    // ==========================================
    // Recompute Product Rating + Notify Seller
    // ==========================================

    await recalculateProductRating(productId);

    await notifySellerOfReview(review, product);

    // ==========================================
    // Mark the purchased order item as reviewed
    // ==========================================

    if (order && item?._id) {
        await reviewRepository.markOrderItemReviewed(
            order,
            item._id,
            review._id
        );
    }

    return review;
};

// ==========================================
// Update Own Review
// ==========================================

const updateReviewService = async (userId, reviewId, payload) => {
    if (!userId) {
        throw new AppError("User ID is required.", 400);
    }

    if (!isValidId(reviewId)) {
        throw new AppError("Invalid review ID.", 400);
    }

    const review = await reviewRepository.findReviewById(reviewId);

    if (!review || review.user._id.toString() !== userId.toString()) {
        throw new AppError("Review not found or you are not the author.", 404);
    }

    // ==========================================
    // Edit Window
    // ==========================================

    if (
        Date.now() - new Date(review.createdAt).getTime() >
        EDIT_WINDOW_MS
    ) {
        throw new AppError(
            "Reviews can only be edited within 30 days of posting.",
            400
        );
    }

    const updateData = {};

    if (payload.rating !== undefined) updateData.rating = payload.rating;
    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.description !== undefined)
        updateData.description = payload.description;
    if (payload.images !== undefined) updateData.images = payload.images;

    const updated = await reviewRepository.updateReview(
        reviewId,
        userId,
        updateData
    );

    const productId =
        updated.product?._id?.toString() || updated.product?.toString();

    await recalculateProductRating(productId);

    return updated;
};

// ==========================================
// Delete Own Review
// ==========================================

const deleteReviewService = async (userId, reviewId) => {
    if (!userId) {
        throw new AppError("User ID is required.", 400);
    }

    if (!isValidId(reviewId)) {
        throw new AppError("Invalid review ID.", 400);
    }

    const deleted = await reviewRepository.deleteReview(reviewId, userId);

    if (!deleted) {
        throw new AppError("Review not found or you are not the author.", 404);
    }

    const productId = deleted.product?.toString();

    await recalculateProductRating(productId);

    // Reset the purchased order item so the customer can review again.
    if (deleted.order && deleted.orderItem) {
        await reviewRepository.unmarkOrderItemReviewed(
            deleted.order,
            deleted.orderItem
        );
    }

    return deleted;
};

// ==========================================
// My Reviews
// ==========================================

const getMyReviewsService = async (userId, query = {}) => {
    if (!userId) {
        throw new AppError("User ID is required.", 400);
    }

    const { page, limit } = getPagination(query);

    return await reviewRepository.findReviewsByUser(userId, {
        page,
        limit,
    });
};

// ==========================================
// Review Eligibility (for "Write a Review")
// ==========================================

const getReviewEligibilityService = async (userId, productId) => {
    if (!userId) {
        throw new AppError("User ID is required.", 400);
    }

    if (!isValidId(productId)) {
        throw new AppError("Invalid product ID.", 400);
    }

    const existing =
        await reviewRepository.findReviewByUserAndProduct(userId, productId);

    const { eligible } = await findPurchasedOrderItem(userId, productId);

    return {
        canReview: !existing && eligible,
        alreadyReviewed: Boolean(existing),
        verifiedPurchase: eligible,
        existingReview: existing,
    };
};

// ==========================================
// Helpful Toggle
// ==========================================

const toggleHelpfulService = async (userId, reviewId) => {
    if (!userId) {
        throw new AppError("User ID is required.", 400);
    }

    if (!isValidId(reviewId)) {
        throw new AppError("Invalid review ID.", 400);
    }

    const review = await reviewRepository.findReviewById(reviewId);

    if (!review) {
        throw new AppError("Review not found.", 404);
    }

    if (review.user._id.toString() === userId.toString()) {
        throw new AppError("You cannot mark your own review as helpful.", 403);
    }

    const updated = await reviewRepository.toggleHelpful(reviewId, userId);

    return {
        helpfulCount: updated.helpfulCount || 0,
        helpful: (updated.helpfulUsers || []).some(
            (id) => id.toString() === userId.toString()
        ),
    };
};

// ==========================================
// Report Review
// ==========================================

const reportReviewService = async (userId, reviewId, reason = "") => {
    if (!userId) {
        throw new AppError("User ID is required.", 400);
    }

    if (!isValidId(reviewId)) {
        throw new AppError("Invalid review ID.", 400);
    }

    const review = await reviewRepository.findReviewById(reviewId);

    if (!review) {
        throw new AppError("Review not found.", 404);
    }

    if (review.user._id.toString() === userId.toString()) {
        throw new AppError("You cannot report your own review.", 403);
    }

    const alreadyReported = (review.reportUsers || []).some(
        (id) => id.toString() === userId.toString()
    );

    if (!alreadyReported) {
        await reviewRepository.reportReview(reviewId, userId, reason);
    }

    return { reported: !alreadyReported };
};

// ==========================================
// Seller: Reviews Received
// ==========================================

const getSellerReviewsService = async (userId, query = {}) => {
    const seller = await getSellerByUserId(userId);

    const { page, limit } = getPagination(query);

    return await reviewRepository.findReviewsBySeller(seller._id, {
        page,
        limit,
        sort: query.sort,
        search: query.search,
        rating: query.rating,
        productId: query.productId,
        withImages: query.withImages,
        replied: query.replied,
    });
};

// ==========================================
// Seller: Product Filter List
// ==========================================

const getSellerProductListService = async (userId) => {
    const seller = await getSellerByUserId(userId);

    return await reviewRepository.getSellerProductsForFilter(seller._id);
};

// ==========================================
// Seller: Stats + Analytics
// ==========================================

const getSellerReviewStatsService = async (userId) => {
    const seller = await getSellerByUserId(userId);

    const [stats, distribution, monthly, top, lowest] = await Promise.all([
        reviewRepository.getSellerReviewStats(seller._id),
        reviewRepository.getSellerRatingDistribution(seller._id),
        reviewRepository.getSellerMonthlyReviews(seller._id),
        reviewRepository.getTopRatedProducts(seller._id),
        reviewRepository.getLowestRatedProducts(seller._id),
    ]);

    return {
        stats,
        distribution,
        monthly,
        topProducts: top,
        lowestProducts: lowest,
    };
};

// ==========================================
// Seller: Review Detail + Reply
// ==========================================

const getSellerReviewDetailService = async (userId, reviewId) => {
    const seller = await getSellerByUserId(userId);

    if (!isValidId(reviewId)) {
        throw new AppError("Invalid review ID.", 400);
    }

    const review = await reviewRepository.findReviewForSellerReply(
        reviewId,
        seller._id
    );

    if (!review) {
        throw new AppError("Review not found for your products.", 404);
    }

    return review;
};

const replyToReviewService = async (userId, reviewId, reply) => {
    const seller = await getSellerByUserId(userId);

    if (!isValidId(reviewId)) {
        throw new AppError("Invalid review ID.", 400);
    }

    const review = await reviewRepository.findReviewForSellerReply(
        reviewId,
        seller._id
    );

    if (!review) {
        throw new AppError("Review not found for your products.", 404);
    }

    return await reviewRepository.updateSellerReply(reviewId, reply);
};

// ==========================================
// Admin: Moderation
// ==========================================

const getAdminReviewsService = async (query = {}) => {
    const { page, limit } = getPagination(query);

    return await reviewRepository.findAllReviews({
        page,
        limit,
        status: query.status,
        search: query.search,
        sort: query.sort,
    });
};

const getReportedReviewsService = async (query = {}) => {
    const { page, limit } = getPagination(query);

    return await reviewRepository.findReportedReviews({ page, limit });
};

const updateReviewStatusService = async (reviewId, status) => {
    if (!isValidId(reviewId)) {
        throw new AppError("Invalid review ID.", 400);
    }

    const review = await reviewRepository.updateReviewStatus(
        reviewId,
        status
    );

    if (!review) {
        throw new AppError("Review not found.", 404);
    }

    const productId = review.product?.toString();

    await recalculateProductRating(productId);

    return review;
};

const deleteReviewByIdService = async (reviewId) => {
    if (!isValidId(reviewId)) {
        throw new AppError("Invalid review ID.", 400);
    }

    const deleted = await reviewRepository.deleteReviewById(reviewId);

    if (!deleted) {
        throw new AppError("Review not found.", 404);
    }

    const productId = deleted.product?.toString();

    await recalculateProductRating(productId);

    return deleted;
};

// ==========================================
// Public: Get A Single Review
// ==========================================

const getReviewByIdService = async (reviewId) => {
    if (!isValidId(reviewId)) {
        throw new AppError("Invalid review ID.", 400);
    }

    const review = await reviewRepository.findReviewById(reviewId);

    if (!review) {
        throw new AppError("Review not found.", 404);
    }

    return review;
};

// ==========================================
// Admin: Moderation Analytics
// ==========================================

const getAdminReviewStatsService = async () => {
    return await reviewRepository.getAdminReviewStats();
};

// ==========================================
// Exports
// ==========================================

module.exports = {
    getProductReviewsService,
    getProductReviewSummaryService,
    getReviewByIdService,
    createReviewService,
    updateReviewService,
    deleteReviewService,
    getMyReviewsService,
    getReviewEligibilityService,
    toggleHelpfulService,
    reportReviewService,
    getSellerReviewsService,
    getSellerProductListService,
    getSellerReviewStatsService,
    getSellerReviewDetailService,
    replyToReviewService,
    getAdminReviewsService,
    getReportedReviewsService,
    getAdminReviewStatsService,
    updateReviewStatusService,
    deleteReviewByIdService,
};
