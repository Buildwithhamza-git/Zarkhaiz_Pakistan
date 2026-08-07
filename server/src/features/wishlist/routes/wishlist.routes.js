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
} = require("../controller/wishlist.controller");

// Get current user's wishlist
router.get("/", authenticate, getWishlist);

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