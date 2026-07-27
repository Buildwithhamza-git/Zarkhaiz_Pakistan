const mongoose = require("mongoose");

const {
    findOrCreateCart,
    saveCart,
    deleteCartByUser,
} = require("../repository/cart.repository");

const Product = require("../../product/product.model");
const Seller = require("../../seller/model/seller.model");

// ==========================================
// Helper: Get Product ID From Cart Item
// ==========================================

const getCartProductId = (item) => {
    if (!item?.product) {
        return null;
    }

    // If product is populated
    if (item.product._id) {
        return item.product._id.toString();
    }

    // If product is still an ObjectId
    return item.product.toString();
};

// ==========================================
// Get Current User Cart
// ==========================================

const getUserCart = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    return await findOrCreateCart(userId);
};

// ==========================================
// Add Product To Cart
// ==========================================

const addProductToCart = async (
    userId,
    productId,
    quantity = 1
) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID.");
    }

    const numericQuantity = Number(quantity);

    if (
        !Number.isInteger(numericQuantity) ||
        numericQuantity < 1
    ) {
        throw new Error("Quantity must be at least 1.");
    }

    // ==========================================
    // Find Product
    // ==========================================

    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found.");
    }

    // ==========================================
    // Product Status
    // ==========================================

    if (
        product.status &&
        product.status.toLowerCase() !== "active"
    ) {
        throw new Error(
            "This product is not currently available."
        );
    }

    // ==========================================
    // Stock Check
    // ==========================================

    const availableStock = Number(product.stock || 0);

    if (availableStock < 1) {
        throw new Error(
            "This product is out of stock."
        );
    }

    if (numericQuantity > availableStock) {
        throw new Error(
            `Only ${availableStock} units are available.`
        );
    }

    // ==========================================
    // Seller Ownership Check
    // ==========================================

    if (product.seller) {
        const seller = await Seller.findById(
            product.seller
        ).select("user");

        if (seller?.user) {
            const productOwnerId =
                seller.user.toString();

            const currentUserId =
                userId.toString();

            if (
                productOwnerId === currentUserId
            ) {
                throw new Error(
                    "You cannot purchase your own product."
                );
            }
        }
    }

    // ==========================================
    // Get / Create Cart
    // ==========================================

    const cart = await findOrCreateCart(userId);

    // ==========================================
    // Find Existing Product
    // ==========================================

    const existingItem = cart.items.find(
        (item) =>
            getCartProductId(item) ===
            productId.toString()
    );

    // ==========================================
    // Existing Item
    // ==========================================

    if (existingItem) {
        const newQuantity =
            Number(existingItem.quantity) +
            numericQuantity;

        if (newQuantity > availableStock) {
            throw new Error(
                `Only ${availableStock} units are available.`
            );
        }

        existingItem.quantity = newQuantity;
    }

    // ==========================================
    // New Item
    // ==========================================

    else {
        cart.items.push({
            product: product._id,
            quantity: numericQuantity,
        });
    }

    await saveCart(cart);

    return await findOrCreateCart(userId);
};

// ==========================================
// Update Cart Item Quantity
// ==========================================

const updateCartItemQuantity = async (
    userId,
    productId,
    quantity
) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID.");
    }

    const numericQuantity = Number(quantity);

    if (
        !Number.isInteger(numericQuantity) ||
        numericQuantity < 1
    ) {
        throw new Error(
            "Quantity must be at least 1."
        );
    }

    // ==========================================
    // Get Cart
    // ==========================================

    const cart =
        await findOrCreateCart(userId);

    // ==========================================
    // Find Cart Item
    // ==========================================

    const item = cart.items.find(
        (cartItem) =>
            getCartProductId(cartItem) ===
            productId.toString()
    );

    if (!item) {
        throw new Error(
            "Product is not in your cart."
        );
    }

    // ==========================================
    // Find Product
    // ==========================================

    const product =
        await Product.findById(productId);

    if (!product) {
        throw new Error(
            "Product not found."
        );
    }

    // ==========================================
    // Stock Check
    // ==========================================

    const availableStock =
        Number(product.stock || 0);

    if (availableStock < 1) {
        throw new Error(
            "This product is currently out of stock."
        );
    }

    if (numericQuantity > availableStock) {
        throw new Error(
            `Only ${availableStock} units are available.`
        );
    }

    // ==========================================
    // Update Quantity
    // ==========================================

    item.quantity = numericQuantity;

    await saveCart(cart);

    return await findOrCreateCart(userId);
};

// ==========================================
// Remove Product From Cart
// ==========================================

const removeProductFromCart = async (
    userId,
    productId
) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error(
            "Invalid product ID."
        );
    }

    const cart =
        await findOrCreateCart(userId);

    const originalLength =
        cart.items.length;

    cart.items = cart.items.filter(
        (item) =>
            getCartProductId(item) !==
            productId.toString()
    );

    if (
        cart.items.length ===
        originalLength
    ) {
        throw new Error(
            "Product is not in your cart."
        );
    }

    await saveCart(cart);

    return await findOrCreateCart(userId);
};

// ==========================================
// Clear User Cart
// ==========================================

const clearUserCart = async (userId) => {
    if (!userId) {
        throw new Error(
            "User ID is required."
        );
    }

    await deleteCartByUser(userId);

    return {
        items: [],
        totalItems: 0,
        subtotal: 0,
    };
};

// ==========================================
// Exports
// ==========================================

module.exports = {
    getUserCart,
    addProductToCart,
    updateCartItemQuantity,
    removeProductFromCart,
    clearUserCart,
};