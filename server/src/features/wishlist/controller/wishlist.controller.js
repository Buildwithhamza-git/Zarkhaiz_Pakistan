const {
    getUserWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    notifySellerAboutWishlist,
} = require("../service/wishlist.service");

// ==========================================
// GET /api/wishlist
// ==========================================

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;

        const wishlist = await getUserWishlist(userId);

        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully.",
            data: {
                wishlist,
            },
        });
    } catch (error) {
        console.error("Get wishlist error:", error);

        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch wishlist.",
        });
    }
};

// ==========================================
// POST /api/wishlist
// ==========================================

const addWishlistItem = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            productId,
            notifySeller = false,
        } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required.",
            });
        }

        const wishlist = await addProductToWishlist(
            userId,
            productId,
            notifySeller
        );

        return res.status(201).json({
            success: true,
            message:
                "Product added to wishlist successfully.",
            data: {
                wishlist,
            },
        });
    } catch (error) {
        console.error(
            "Add wishlist item error:",
            error
        );

        // Seller cannot wishlist own product
        if (
            error.message ===
            "You cannot wishlist your own product."
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
                "Failed to add product to wishlist.",
        });
    }
};

// ==========================================
// DELETE /api/wishlist/:id  (id = productId)
// ==========================================

const removeWishlistItem = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { id: productId } = req.params;

        const wishlist =
            await removeProductFromWishlist(
                userId,
                productId
            );

        return res.status(200).json({
            success: true,
            message:
                "Product removed from wishlist successfully.",
            data: {
                wishlist,
            },
        });
    } catch (error) {
        console.error(
            "Remove wishlist item error:",
            error
        );

        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to remove wishlist item.",
        });
    }
};

// ==========================================
// POST /api/wishlist/:id/notify  (id = productId)
// ==========================================

const notifySeller = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { id: productId } = req.params;

        const wishlist =
            await notifySellerAboutWishlist(
                userId,
                productId
            );

        return res.status(200).json({
            success: true,
            message: "Seller notified successfully.",
            data: {
                wishlist,
            },
        });
    } catch (error) {
        console.error(
            "Notify seller error:",
            error
        );

        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to notify seller.",
        });
    }
};

module.exports = {
    getWishlist,
    addWishlistItem,
    removeWishlistItem,
    notifySeller,
};