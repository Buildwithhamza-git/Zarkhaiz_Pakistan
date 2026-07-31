import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  getCart,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  removeCartItem as removeCartItemApi,
  clearCart as clearCartApi,
} from "../features/cart/api/cartApi";

import { useAuthContext } from "./authContext";

const CartContext = createContext(null);

const EMPTY_CART = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

// =====================================================
// Extract cart from different possible API responses
// =====================================================

const extractCart = (response) => {
  if (!response) {
    return null;
  }

  // Possible:
  // { data: { cart: {...} } }
  if (response?.data?.cart) {
    return response.data.cart;
  }

  // Possible:
  // { cart: {...} }
  if (response?.cart) {
    return response.cart;
  }

  // Possible:
  // { data: {...cart} }
  if (
    response?.data &&
    Array.isArray(response.data.items)
  ) {
    return response.data;
  }

  // Possible:
  // {...cart}
  if (Array.isArray(response?.items)) {
    return response;
  }

  return null;
};

export default function CartContextProvider({
  children,
}) {
  const navigate = useNavigate();

  const {
    token,
    loading: authLoading,
  } = useAuthContext();

  // =====================================================
  // Cart state
  // =====================================================

  const [cart, setCart] = useState(EMPTY_CART);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // Individual action loading states
  // =====================================================

  const [addingProductId, setAddingProductId] =
    useState(null);

  const [updatingProductId, setUpdatingProductId] =
    useState(null);

  const [removingProductId, setRemovingProductId] =
    useState(null);

  const [clearingCart, setClearingCart] =
    useState(false);

  // =====================================================
  // Normalize cart
  // =====================================================

  const normalizeCart = useCallback((data) => {
    if (!data) {
      return EMPTY_CART;
    }

    const items = Array.isArray(data.items)
      ? data.items
      : [];

    const totalItems = items.reduce(
      (total, item) => {
        return (
          total +
          Number(item.quantity || 0)
        );
      },
      0
    );

    const subtotal = items.reduce(
      (total, item) => {
        const product = item.product || {};

        const price = Number(
          product.price ??
            item.price ??
            0
        );

        const quantity = Number(
          item.quantity || 0
        );

        return (
          total +
          price * quantity
        );
      },
      0
    );

    return {
      ...data,
      items,
      totalItems,
      subtotal,
    };
  }, []);

  // =====================================================
  // Require login
  // =====================================================

  const requireLogin = useCallback(() => {
    if (token) {
      return true;
    }

    navigate("/login", {
      state: {
        from: window.location.pathname,
        message:
          "Please login to continue.",
      },
    });

    return false;
  }, [token, navigate]);

  // =====================================================
  // Fetch cart
  // =====================================================

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart(EMPTY_CART);
      setLoading(false);
      return EMPTY_CART;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getCart();

      const cartData =
        extractCart(response) ||
        EMPTY_CART;

      const normalized =
        normalizeCart(cartData);

      setCart(normalized);

      return normalized;
    } catch (err) {
      console.error(
        "Fetch cart error:",
        err
      );

      setCart(EMPTY_CART);

      setError(
        err?.message ||
          "Failed to load cart."
      );

      return null;
    } finally {
      setLoading(false);
    }
  }, [token, normalizeCart]);

  // =====================================================
  // Initialize cart
  // =====================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchCart();
  }, [authLoading, fetchCart]);

  // =====================================================
  // Add to cart
  // =====================================================

  const addToCart = useCallback(
    async (
      productId,
      quantity = 1
    ) => {
      if (!requireLogin()) {
        return null;
      }

      if (!productId) {
        throw new Error(
          "Product ID is required."
        );
      }

      if (addingProductId === productId) {
        return null;
      }

      try {
        setAddingProductId(productId);
        setError("");

        const response =
          await addToCartApi(
            productId,
            quantity
          );

        const cartData =
          extractCart(response);

        if (cartData) {
          setCart(
            normalizeCart(cartData)
          );
        } else {
          await fetchCart();
        }

        return response;
      } catch (err) {
        console.error(
          "Add to cart error:",
          err
        );

        setError(
          err?.message ||
            "Failed to add product to cart."
        );

        throw err;
      } finally {
        setAddingProductId(null);
      }
    },
    [
      requireLogin,
      addingProductId,
      normalizeCart,
      fetchCart,
    ]
  );

  // =====================================================
  // Update quantity
  // =====================================================

  const updateQuantity = useCallback(
    async (
      productId,
      quantity
    ) => {
      if (!requireLogin()) {
        return null;
      }

      if (!productId) {
        throw new Error(
          "Product ID is required."
        );
      }

      const numericQuantity =
        Number(quantity);

      if (
        !Number.isInteger(
          numericQuantity
        )
      ) {
        throw new Error(
          "Quantity must be a whole number."
        );
      }

      // Quantity 0 means remove
      if (numericQuantity <= 0) {
        return removeItem(productId);
      }

      try {
        setUpdatingProductId(productId);
        setError("");

        const response =
          await updateCartItemApi(
            productId,
            numericQuantity
          );

        const cartData =
          extractCart(response);

        if (cartData) {
          setCart(
            normalizeCart(cartData)
          );
        } else {
          await fetchCart();
        }

        return response;
      } catch (err) {
        console.error(
          "Update cart error:",
          err
        );

        setError(
          err?.message ||
            "Failed to update cart."
        );

        throw err;
      } finally {
        setUpdatingProductId(null);
      }
    },
    [
      requireLogin,
      normalizeCart,
      fetchCart,
    ]
  );

  // =====================================================
  // Remove item
  // =====================================================

  const removeItem = useCallback(
    async (productId) => {
      if (!requireLogin()) {
        return null;
      }

      if (!productId) {
        throw new Error(
          "Product ID is required."
        );
      }

      try {
        setRemovingProductId(productId);
        setError("");

        const response =
          await removeCartItemApi(
            productId
          );

        const cartData =
          extractCart(response);

        if (cartData) {
          setCart(
            normalizeCart(cartData)
          );
        } else {
          await fetchCart();
        }

        return response;
      } catch (err) {
        console.error(
          "Remove cart item error:",
          err
        );

        setError(
          err?.message ||
            "Failed to remove item."
        );

        throw err;
      } finally {
        setRemovingProductId(null);
      }
    },
    [
      requireLogin,
      normalizeCart,
      fetchCart,
    ]
  );

  // =====================================================
  // Clear cart
  // =====================================================

  const clearCart = useCallback(
    async () => {
      if (!requireLogin()) {
        return null;
      }

      try {
        setClearingCart(true);
        setError("");

        const response =
          await clearCartApi();

        // Cart is definitely empty
        // after successful DELETE
        setCart(EMPTY_CART);

        return response;
      } catch (err) {
        console.error(
          "Clear cart error:",
          err
        );

        setError(
          err?.message ||
            "Failed to clear cart."
        );

        throw err;
      } finally {
        setClearingCart(false);
      }
    },
    [requireLogin]
  );

  // =====================================================
  // Clear error
  // =====================================================

  const clearCartError =
    useCallback(() => {
      setError("");
    }, []);

  // =====================================================
  // Context value
  // =====================================================

  const value = useMemo(
    () => ({
      // Cart
      cart,
      items: cart.items,

      // Calculations
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,

      // Initial loading
      loading,

      // Individual loading states
      addingProductId,
      updatingProductId,
      removingProductId,
      clearingCart,

      // Backward-compatible global state
      actionLoading:
        Boolean(addingProductId) ||
        Boolean(updatingProductId) ||
        Boolean(removingProductId) ||
        clearingCart,

      // Error
      error,

      // Operations
      fetchCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      clearCartError,
    }),
    [
      cart,
      loading,
      addingProductId,
      updatingProductId,
      removingProductId,
      clearingCart,
      error,
      fetchCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      clearCartError,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// =====================================================
// Hook
// =====================================================

export function useCartContext() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCartContext must be used inside CartContextProvider."
    );
  }

  return context;
}