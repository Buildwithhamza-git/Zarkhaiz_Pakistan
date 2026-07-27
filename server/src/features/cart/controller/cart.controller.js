const {
    getUserCart,
    addProductToCart,
    updateCartItemQuantity,
    removeProductFromCart,
    clearUserCart,
} = require("../service/cart.service");


// ==========================================
// GET /api/cart
// ==========================================

const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await getUserCart(userId);

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully.",
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error("Get cart error:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch cart.",
        });
    }
};

// ==========================================
// POST /api/cart/items
// ==========================================

const addCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            productId,
            quantity = 1,
        } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required.",
            });
        }

        const cart = await addProductToCart(
            userId,
            productId,
            quantity
        );

        return res.status(201).json({
            success: true,
            message:
                "Product added to cart successfully.",
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error(
            "Add cart item error:",
            error
        );

        // Seller cannot purchase own product
        if (
            error.message ===
            "You cannot purchase your own product."
        ) {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to add product to cart.",
        });
    }
};

// ==========================================
// PATCH /api/cart/items/:productId
// ==========================================

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Quantity is required.",
            });
        }

        const cart =
            await updateCartItemQuantity(
                userId,
                productId,
                quantity
            );

        return res.status(200).json({
            success: true,
            message:
                "Cart quantity updated successfully.",
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error(
            "Update cart item error:",
            error
        );

        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to update cart item.",
        });
    }
};

// ==========================================
// DELETE /api/cart/items/:productId
// ==========================================

const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { productId } = req.params;

        const cart =
            await removeProductFromCart(
                userId,
                productId
            );

        return res.status(200).json({
            success: true,
            message:
                "Product removed from cart successfully.",
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error(
            "Remove cart item error:",
            error
        );

        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to remove cart item.",
        });
    }
};

// ==========================================
// DELETE /api/cart
// ==========================================

const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart =
            await clearUserCart(userId);

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully.",
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error(
            "Clear cart error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to clear cart.",
        });
    }
};

module.exports = {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
};