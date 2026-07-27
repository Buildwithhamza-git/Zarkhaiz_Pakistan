import { useCallback, useEffect, useState } from "react";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../api/cartApi";

export default function useCart() {
  const [cart, setCart] = useState(null);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // Load Cart
  // ==========================================

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCart();

      const cartData =
        response?.data?.cart ||
        response?.cart ||
        null;

      setCart(cartData);
    } catch (err) {
      console.error("Failed to load cart:", err);

      setError(
        err?.message ||
          "Unable to load your cart."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // Add Item
  // ==========================================

  const handleAddToCart = async (
    productId,
    quantity = 1
  ) => {
    try {
      setActionLoading(true);
      setError("");

      const response = await addToCart(
        productId,
        quantity
      );

      const cartData =
        response?.data?.cart ||
        response?.cart ||
        null;

      if (cartData) {
        setCart(cartData);
      } else {
        await fetchCart();
      }

      return response;
    } catch (err) {
      console.error("Add to cart failed:", err);

      setError(
        err?.message ||
          "Unable to add product to cart."
      );

      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Update Quantity
  // ==========================================

  const handleUpdateQuantity = async (
    productId,
    quantity
  ) => {
    if (quantity < 1) return;

    try {
      setActionLoading(true);
      setError("");

      const response =
        await updateCartItem(
          productId,
          quantity
        );

      const cartData =
        response?.data?.cart ||
        response?.cart ||
        null;

      if (cartData) {
        setCart(cartData);
      } else {
        await fetchCart();
      }

      return response;
    } catch (err) {
      console.error(
        "Update cart failed:",
        err
      );

      setError(
        err?.message ||
          "Unable to update cart."
      );

      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Remove Item
  // ==========================================

  const handleRemoveItem = async (
    productId
  ) => {
    try {
      setActionLoading(true);
      setError("");

      const response =
        await removeCartItem(productId);

      const cartData =
        response?.data?.cart ||
        response?.cart ||
        null;

      if (cartData) {
        setCart(cartData);
      } else {
        await fetchCart();
      }

      return response;
    } catch (err) {
      console.error(
        "Remove cart item failed:",
        err
      );

      setError(
        err?.message ||
          "Unable to remove item."
      );

      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Clear Cart
  // ==========================================

  const handleClearCart = async () => {
    try {
      setActionLoading(true);
      setError("");

      await clearCart();

      setCart({
        items: [],
        totalItems: 0,
        subtotal: 0,
      });
    } catch (err) {
      console.error(
        "Clear cart failed:",
        err
      );

      setError(
        err?.message ||
          "Unable to clear cart."
      );

      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ==========================================
  // Derived Values
  // ==========================================

  const items = cart?.items || [];

  const totalItems = items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const subtotal = items.reduce(
    (total, item) => {
      const price =
        Number(
          item.product?.price ??
            item.price ??
            0
        );

      const quantity =
        Number(item.quantity || 0);

      return total + price * quantity;
    },
    0
  );

  return {
    cart,
    items,

    totalItems,

    subtotal,

    loading,
    actionLoading,
    error,

    fetchCart,

    addToCart: handleAddToCart,

    updateQuantity:
      handleUpdateQuantity,

    removeItem:
      handleRemoveItem,

    clearCart:
      handleClearCart,
  };
}