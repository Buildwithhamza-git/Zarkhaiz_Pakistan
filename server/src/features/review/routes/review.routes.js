const router = require("express").Router();

const authenticate = require("../../../middlewares/authenticate");
const requireAdmin = require("../../../middlewares/requireAdmin");
const validateRequest = require("../../../middlewares/validateRequest");
const uploadReview = require("../../../shared/uploadmiddleware/uploadReview");

const {
    createReviewSchema,
    updateReviewSchema,
    sellerReplySchema,
    reportReviewSchema,
    reviewStatusSchema,
} = require("../validation/review.validation");

const {
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
} = require("../controller/review.controller");

// ====================================
// Public Routes
// ====================================

// Get approved reviews + rating summary for a product
router.get("/product/:productId", getProductReviews);

// Get rating summary + customer photo gallery for a product
router.get("/product/:productId/summary", getProductReviewSummary);

// ====================================
// Admin Routes (order matters: before :id routes)
// ====================================

router.get("/admin/reviews", authenticate, requireAdmin, getAdminReviews);

router.get("/admin/reported", authenticate, requireAdmin, getReportedReviews);

router.get("/admin/stats", authenticate, requireAdmin, getAdminReviewStats);

router.patch(
    "/admin/:id/status",
    authenticate,
    requireAdmin,
    validateRequest(reviewStatusSchema),
    setReviewStatus
);

router.delete("/admin/:id", authenticate, requireAdmin, deleteReviewById);

// ====================================
// Seller Routes (order matters: before :id routes)
// ====================================

// Reviews received by the current seller
router.get("/seller/reviews", authenticate, getSellerReviews);

// Products (that received reviews) for the seller filter dropdown
router.get("/seller/products", authenticate, getSellerProducts);

// Seller review stats + analytics dashboard
router.get("/seller/stats", authenticate, getSellerReviewStats);

// Single review detail (for the seller reply drawer)
router.get("/seller/:id", authenticate, getSellerReviewDetail);

// Reply to a review on the seller's product
router.post(
    "/:id/reply",
    authenticate,
    validateRequest(sellerReplySchema),
    replyToReview
);

// ====================================
// Authenticated Routes
// ====================================

// Current user's reviews
router.get("/my-reviews", authenticate, getMyReviews);

// Whether the current user can review a product
router.get(
    "/eligibility/:productId",
    authenticate,
    getReviewEligibility
);

// Create a review (multipart for image uploads)
router.post(
    "/",
    authenticate,
    uploadReview.array("images", 5),
    validateRequest(createReviewSchema),
    createReview
);

// Mark / unmark a review as helpful
router.post("/:id/helpful", authenticate, toggleHelpful);

// Report a review
router.post(
    "/:id/report",
    authenticate,
    validateRequest(reportReviewSchema),
    reportReview
);

// ====================================
// Own Review Management (Must Be Last)
// ====================================

// Get a single review
router.get("/:id", getReviewById);

// Update own review (multipart for image uploads)
router.patch(
    "/:id",
    authenticate,
    uploadReview.array("images", 5),
    validateRequest(updateReviewSchema),
    updateReview
);

router.delete("/:id", authenticate, deleteReview);

module.exports = router;
