const mongoose = require("mongoose");

const {
    findWishlistByUser,
    findWishlistItem,
    createWishlistItem,
    deleteWishlistItem,
    updateNotifySeller,
    countWishlistByUser,
    aggregateWishlistBySeller,
} = require("../repository/wishlist.repository");

const Product = require("../../product/product.model");
const Seller = require("../../seller/model/seller.model");
const { User } = require("../../users/user.model");

const {
    createNotificationsForUsersService,
} = require("../../notification/notification.service");

// ==========================================
// Helper: Build seller notification payload
// ==========================================

const buildWishlistNotification = (buyer, product) => {
    const buyerName =
        `${buyer?.firstname || ""} ${buyer?.lastname || ""}`.trim() ||
        "A buyer";

    return {
        type: "seller",
        title: "Product added to a wishlist",
        message: `${buyerName} has added your ${product.name} to their wishlist.`,
        data: {
            productId: product._id,
            productName: product.name,
        },
    };
};

// ==========================================
// Get Current User Wishlist
// ==========================================

const getUserWishlist = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    return await findWishlistByUser(userId);
};

// ==========================================
// Add Product To Wishlist
// ==========================================

const addProductToWishlist = async (
    userId,
    productId,
    notifySeller = false
) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID.");
    }

    // ==========================================
    // Find Product
    // ==========================================

    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found.");
    }

    // ==========================================
    // Find Seller
    // ==========================================

    const seller = await Seller.findById(product.seller).select("user");

    if (!seller) {
        throw new Error("Seller not found for this product.");
    }

    // ==========================================
    // Seller Ownership Check
    // ==========================================

    if (seller.user && seller.user.toString() === userId.toString()) {
        throw new Error("You cannot wishlist your own product.");
    }

    // ==========================================
    // Existing Entry (prevent duplicates)
    // ==========================================

    const existing = await findWishlistItem(userId, productId);

    if (existing) {
        // Already wishlisted — only send a notification if the seller
        // hasn't already been notified for this item.
        if (notifySeller && !existing.notifySeller) {
            existing.notifySeller = true;
            await existing.save();

            const buyer = await User.findById(userId).select(
                "firstname lastname"
            );

            await createNotificationsForUsersService(
                [seller.user],
                buildWishlistNotification(buyer, product)
            );
        }

        return await findWishlistByUser(userId);
    }

    // ==========================================
    // Create New Entry
    // ==========================================

    await createWishlistItem({
        user: userId,
        product: product._id,
        seller: seller._id,
        notifySeller: Boolean(notifySeller),
    });

    if (notifySeller) {
        const buyer = await User.findById(userId).select(
            "firstname lastname"
        );

        await createNotificationsForUsersService(
            [seller.user],
            buildWishlistNotification(buyer, product)
        );
    }

    return await findWishlistByUser(userId);
};

// ==========================================
// Remove Product From Wishlist
// ==========================================

const removeProductFromWishlist = async (userId, productId) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID.");
    }

    const removed = await deleteWishlistItem(userId, productId);

    if (!removed) {
        throw new Error("Product is not in your wishlist.");
    }

    return await findWishlistByUser(userId);
};

// ==========================================
// Notify Seller (manual trigger — e.g. "Notify Me" on an
// out-of-stock product already sitting in the wishlist)
// ==========================================

const notifySellerAboutWishlist = async (userId, productId) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID.");
    }

    const item = await findWishlistItem(userId, productId);

    if (!item) {
        throw new Error("Product is not in your wishlist.");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found.");
    }

    const seller = await Seller.findById(product.seller).select("user");

    if (!seller) {
        throw new Error("Seller not found for this product.");
    }

    await updateNotifySeller(userId, productId, true);

    const buyer = await User.findById(userId).select("firstname lastname");

    await createNotificationsForUsersService(
        [seller.user],
        buildWishlistNotification(buyer, product)
    );

    return await findWishlistByUser(userId);
};

// ==========================================
// Wishlist Count
// ==========================================

const getWishlistCount = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    return await countWishlistByUser(userId);
};

// ==========================================
// Seller Wishlist Stats (buyer interest)
// ==========================================

const getSellerWishlistStatsService = async (userId, query = {}) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    const seller = await Seller.findOne({ user: userId }).select("_id");

    if (!seller) {
        throw new Error("Seller profile not found.");
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(
        100,
        Math.max(1, parseInt(query.limit, 10) || 20)
    );

    return await aggregateWishlistBySeller(seller._id, { page, limit });
};

// ==========================================
// Exports
// ==========================================

module.exports = {
    getUserWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    notifySellerAboutWishlist,
    getWishlistCount,
    getSellerWishlistStatsService,
};