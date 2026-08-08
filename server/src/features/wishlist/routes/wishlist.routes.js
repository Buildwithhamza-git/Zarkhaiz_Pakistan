const router = require("express").Router();

const authenticate = require("../../../middlewares/authenticate");
const validateRequest = require("../../../middlewares/validateRequest");

const {
    addToWishlistSchema,
} = require("../validation/wishlist.validation");

const {
    getWishlist,
    addWishlistItem,
    removeWishlistItem,
    notifySeller,
    getSellerWishlistStats,
} = require("../controller/wishlist.controller");

// Get current user's wishlist
router.get("/", authenticate, getWishlist);

// Get seller's wishlist stats (products buyers wishlisted + notified about)
router.get("/seller-stats", authenticate, getSellerWishlistStats);

// Add product to wishlist
router.post(
    "/",
    authenticate,
    validateRequest(addToWishlistSchema),
    addWishlistItem
);

// Remove product from wishlist
router.delete("/:id", authenticate, removeWishlistItem);

// Notify seller about a wishlisted product
router.post("/:id/notify", authenticate, notifySeller);

module.exports = router;