const Cart = require("../model/cart.model");

/**
 * Find the cart belonging to a user.
 */
const findCartByUser = async (userId) => {
    return await Cart.findOne({
        user: userId,
    }).populate({
        path: "items.product",
        populate: {
            path: "seller",
            select: "user storeName",
        },
    });
};

/**
 * Create a new cart for a user.
 */
const createCart = async (userId) => {
    return await Cart.create({
        user: userId,
        items: [],
    });
};

/**
 * Find an existing cart or create one.
 */
const findOrCreateCart = async (userId) => {
    let cart = await findCartByUser(userId);

    if (!cart) {
        cart = await createCart(userId);

        // Populate newly created cart consistently.
        cart = await findCartByUser(userId);
    }

    return cart;
};

/**
 * Save cart changes.
 */
const saveCart = async (cart) => {
    return await cart.save();
};

/**
 * Delete user's cart.
 */
const deleteCartByUser = async (userId) => {
    return await Cart.findOneAndDelete({
        user: userId,
    });
};

module.exports = {
    findCartByUser,
    createCart,
    findOrCreateCart,
    saveCart,
    deleteCartByUser,
};