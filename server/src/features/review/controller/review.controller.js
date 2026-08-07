const {
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
} = require("../service/review.service");

const { getUploadedImageUrls } = require("../../product/utils/normalizeUploadedFiles");

const sendError = (res, error, fallback) => {
    console.error(error);

    return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || fallback,
    });
};

// ==========================================
// GET /api/reviews/product/:productId
// ==========================================
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const data = await getProductReviewsService(productId, req.query);

        return res.status(200).json({
            success: true,
            message: "Product reviews fetched successfully.",
            data,
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch product reviews.");
    }
};

// ==========================================
// GET /api/reviews/product/:productId/summary
// ==========================================

const getProductReviewSummary = async (req, res) => {
    try {
        const { productId } = req.params;

        const data = await getProductReviewSummaryService(productId);

        return res.status(200).json({
            success: true,
            message: "Product review summary fetched successfully.",
            data,
        });
    } catch (error) {
        return sendError(
            res,
            error,
            "Failed to fetch product review summary."
        );
    }
};

// ==========================================
// GET /api/reviews/:id
// ==========================================

const getReviewById = async (req, res) => {
    try {
        const { id: reviewId } = req.params;

        const review = await getReviewByIdService(reviewId);

        return res.status(200).json({
            success: true,
            message: "Review fetched successfully.",
            data: { review },
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch review.");
    }
};

// ==========================================
// POST /api/reviews (multipart: images)
// ==========================================

const createReview = async (req, res) => {
    try {
        const userId = req.user.userId;

        const payload = {
            ...req.body,
            images: getUploadedImageUrls(req.files),
        };

        const review = await createReviewService(userId, payload);

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            data: {
                review,
            },
        });
    } catch (error) {
        return sendError(res, error, "Failed to submit review.");
    }
};

// ==========================================
// PATCH /api/reviews/:id (multipart: images)
// ==========================================

const updateReview = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { id: reviewId } = req.params;

        // Images sent from FormData: existing URLs live in
        // `existingImages`, freshly uploaded files are in req.files.
        let existingImages = [];

        if (req.body?.existingImages) {
            try {
                existingImages = JSON.parse(req.body.existingImages);
            } catch {
                existingImages = [];
            }
        }

        const payload = {
            ...req.body,
            images: [
                ...existingImages,
                ...getUploadedImageUrls(req.files),
            ],
        };

        const review = await updateReviewService(
            userId,
            reviewId,
            payload
        );

        return res.status(200).json({
            success: true,
            message: "Review updated successfully.",
            data: {
                review,
            },
        });
    } catch (error) {
        return sendError(res, error, "Failed to update review.");
    }
};

// ==========================================
// DELETE /api/reviews/:id
// ==========================================

const deleteReview = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { id: reviewId } = req.params;

        await deleteReviewService(userId, reviewId);

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully.",
        });
    } catch (error) {
        return sendError(res, error, "Failed to delete review.");
    }
};

// ==========================================
// GET /api/reviews/my-reviews
// ==========================================

const getMyReviews = async (req, res) => {
    try {
        const userId = req.user.userId;

        const data = await getMyReviewsService(userId, req.query);

        return res.status(200).json({
            success: true,
            message: "Your reviews fetched successfully.",
            data,
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch your reviews.");
    }
};

// ==========================================
// GET /api/reviews/eligibility/:productId
// ==========================================

const getReviewEligibility = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { productId } = req.params;

        const data = await getReviewEligibilityService(userId, productId);

        return res.status(200).json({
            success: true,
            message: "Review eligibility fetched successfully.",
            data,
        });
    } catch (error) {
        return sendError(
            res,
            error,
            "Failed to fetch review eligibility."
        );
    }
};

// ==========================================
// POST /api/reviews/:id/helpful
// ==========================================

const toggleHelpful = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { id: reviewId } = req.params;

        const data = await toggleHelpfulService(userId, reviewId);

        return res.status(200).json({
            success: true,
            message: "Review updated successfully.",
            data,
        });
    } catch (error) {
        return sendError(res, error, "Failed to update review.");
    }
};

// ==========================================
// POST /api/reviews/:id/report
// ==========================================

const reportReview = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { id: reviewId } = req.params;

        const data = await reportReviewService(
            userId,
            reviewId,
            req.body.reason
        );

        return res.status(200).json({
            success: true,
            message: "Review reported successfully.",
            data,
        });
    } catch (error) {
        return sendError(res, error, "Failed to report review.");
    }
};

// ==========================================
// GET /api/reviews/seller/reviews  (seller)
// ==========================================

const getSellerReviews = async (req, res) => {
    try {
        const userId = req.user.userId;

        const data = await getSellerReviewsService(userId, req.query);

        return res.status(200).json({
            success: true,
            message: "Seller reviews fetched successfully.",
            data,
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch seller reviews.");
    }
};

// ==========================================
// GET /api/reviews/seller/products  (seller)
// ==========================================

const getSellerProducts = async (req, res) => {
    try {
        const userId = req.user.userId;

        const data = await getSellerProductListService(userId);

        return res.status(200).json({
            success: true,
            message: "Seller products fetched successfully.",
            data,
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch seller products.");
    }
};

// ==========================================
// GET /api/reviews/seller/stats  (seller)
// ==========================================

const getSellerReviewStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const data = await getSellerReviewStatsService(userId);

        return res.status(200).json({
            success: true,
            message: "Seller review stats fetched successfully.",
            data,
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch seller review stats.");
    }
};

// ==========================================
// GET /api/reviews/seller/:id  (seller)
// ==========================================

const getSellerReviewDetail = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { id: reviewId } = req.params;

        const review = await getSellerReviewDetailService(
            userId,
            reviewId
        );

        return res.status(200).json({
            success: true,
            message: "Review fetched successfully.",
            data: {
                review,
            },
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch review.");
    }
};

// ==========================================
// POST /api/reviews/:id/reply  (seller)
// ==========================================

const replyToReview = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { id: reviewId } = req.params;

        const review = await replyToReviewService(
            userId,
            reviewId,
            req.body.reply
        );

        return res.status(200).json({
            success: true,
            message: "Reply posted successfully.",
            data: {
                review,
            },
        });
    } catch (error) {
        return sendError(res, error, "Failed to post reply.");
    }
};

// ==========================================
// GET /api/reviews/admin/reviews  (admin)
// ==========================================

const getAdminReviews = async (req, res) => {
    try {
        const data = await getAdminReviewsService(req.query);

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully.",
            data,
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch reviews.");
    }
};

// ==========================================
// GET /api/reviews/admin/reported  (admin)
// ==========================================

const getReportedReviews = async (req, res) => {
    try {
        const data = await getReportedReviewsService(req.query);

        return res.status(200).json({
            success: true,
            message: "Reported reviews fetched successfully.",
            data,
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch reported reviews.");
    }
};

// ==========================================
// GET /api/reviews/admin/stats  (admin)
// ==========================================

const getAdminReviewStats = async (req, res) => {
    try {
        const data = await getAdminReviewStatsService();

        return res.status(200).json({
            success: true,
            message: "Admin review stats fetched successfully.",
            data,
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch admin review stats.");
    }
};

// ==========================================
// PATCH /api/reviews/admin/:id/status  (admin)
// ==========================================

const setReviewStatus = async (req, res) => {
    try {
        const { id: reviewId } = req.params;

        const review = await updateReviewStatusService(
            reviewId,
            req.body.status
        );

        return res.status(200).json({
            success: true,
            message: "Review status updated successfully.",
            data: {
                review,
            },
        });
    } catch (error) {
        return sendError(res, error, "Failed to update review status.");
    }
};

// ==========================================
// DELETE /api/reviews/admin/:id  (admin)
// ==========================================

const deleteReviewById = async (req, res) => {
    try {
        const { id: reviewId } = req.params;

        await deleteReviewByIdService(reviewId);

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully.",
        });
    } catch (error) {
        return sendError(res, error, "Failed to delete review.");
    }
};

module.exports = {
    getProductReviews,
    getProductReviewSummary,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getMyReviews,
    getReviewEligibility,
    toggleHelpful,
    reportReview,
    getSellerReviews,
    getSellerProducts,
    getSellerReviewStats,
    getSellerReviewDetail,
    replyToReview,
    getAdminReviews,
    getReportedReviews,
    getAdminReviewStats,
    setReviewStatus,
    deleteReviewById,
};
