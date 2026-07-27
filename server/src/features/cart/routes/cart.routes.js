const router = require("express").Router();

const authenticate = require("../../../middlewares/authenticate");

const {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
} = require("../controller/cart.controller");

// Get current user's cart
router.get("/", authenticate, getCart);

// Add product to cart
router.post("/items", authenticate, addCartItem);

// Update quantity
router.patch(
    "/items/:productId",
    authenticate,
    updateCartItem
);

// Remove item
router.delete(
    "/items/:productId",
    authenticate,
    removeCartItem
);

// Clear cart
router.delete("/", authenticate, clearCart);

module.exports = router;