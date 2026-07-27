import { authFetch } from "../../../utlis/authFetch";

/**
 * Get current user's cart
 */
export const getCart = async () => {
  return await authFetch("/cart");
};

/**
 * Add product to cart
 *
 * @param {string} productId
 * @param {number} quantity
 */
export const addToCart = async (productId, quantity = 1) => {
  return await authFetch("/cart/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });
};

/**
 * Update cart item quantity
 *
 * @param {string} productId
 * @param {number} quantity
 */
export const updateCartItem = async (productId, quantity) => {
  return await authFetch(`/cart/items/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity,
    }),
  });
};

/**
 * Remove product from cart
 *
 * @param {string} productId
 */
export const removeCartItem = async (productId) => {
  return await authFetch(`/cart/items/${productId}`, {
    method: "DELETE",
  });
};

/**
 * Clear complete cart
 */
export const clearCart = async () => {
  return await authFetch("/cart", {
    method: "DELETE",
  });
};