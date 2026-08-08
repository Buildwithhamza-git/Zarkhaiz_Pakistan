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
  getWishlist,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
  notifySellerForProduct as notifySellerApi,
} from "../features/wishlist/api/wishlistApi";

import { useAuthContext } from "./authContext";

const WishlistContext = createContext(null);

// =====================================================
// Extract wishlist array from different possible API responses
// =====================================================

const extractWishlist = (response) => {
  if (!response) {
    return [];
  }

  // Possible: { data: { wishlist: [...] } }
  if (Array.isArray(response?.data?.wishlist)) {
    return response.data.wishlist;
  }

  // Possible: { wishlist: [...] }
  if (Array.isArray(response?.wishlist)) {
    return response.wishlist;
  }

  // Possible: { data: [...] }
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

const getItemProductId = (item) => {
  const product = item?.product;
  return product?._id || product?.id || product;
};

export default function WishlistContextProvider({
  children,
}) {
  const navigate = useNavigate();

  const {
    token,
    loading: authLoading,
  } = useAuthContext();

  // =====================================================
  // Wishlist state
  // =====================================================

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ID of the product currently being added / removed / notified
  const [wishlistActionId, setWishlistActionId] =
    useState(null);

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
          "Please login to use your wishlist.",
      },
    });

    return false;
  }, [token, navigate]);

  // =====================================================
  // Fetch wishlist
  // =====================================================

  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setItems([]);
      setLoading(false);
      return [];
    }

    try {
      setLoading(true);
      setError("");

      const response = await getWishlist();

      const wishlist =
        extractWishlist(response);

      setItems(wishlist);

      return wishlist;
    } catch (err) {
      console.error(
        "Fetch wishlist error:",
        err
      );

      setItems([]);

      setError(
        err?.message ||
          "Failed to load wishlist."
      );

      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  // =====================================================
  // Initialize wishlist
  // =====================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchWishlist();
  }, [authLoading, fetchWishlist]);

  // =====================================================
  // Quick lookup set of wishlisted product IDs
  // =====================================================

  const wishlistedIds = useMemo(() => {
    return new Set(
      items
        .map(getItemProductId)
        .filter(Boolean)
        .map(String)
    );
  }, [items]);

  const isWishlisted = useCallback(
    (productId) =>
      wishlistedIds.has(String(productId)),
    [wishlistedIds]
  );

  // =====================================================
  // Add to wishlist
  // =====================================================

  const addToWishlist = useCallback(
    async (
      productId,
      notifySeller = false
    ) => {
      if (!requireLogin()) {
        return null;
      }

      if (!productId) {
        throw new Error(
          "Product ID is required."
        );
      }

      try {
        setWishlistActionId(productId);
        setError("");

        const response =
          await addToWishlistApi(
            productId,
            notifySeller
          );

        // Always refetch so Navbar badge + product cards update immediately
        await fetchWishlist();

        return response;
      } catch (err) {
        console.error(
          "Add to wishlist error:",
          err
        );

        setError(
          err?.message ||
            "Failed to add product to wishlist."
        );

        throw err;
      } finally {
        setWishlistActionId(null);
      }
    },
    [requireLogin, fetchWishlist]
  );

  // =====================================================
  // Remove from wishlist
  // =====================================================

  const removeFromWishlist = useCallback(
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
        setWishlistActionId(productId);
        setError("");

        const response =
          await removeFromWishlistApi(
            productId
          );

        await fetchWishlist();

        return response;
      } catch (err) {
        console.error(
          "Remove from wishlist error:",
          err
        );

        setError(
          err?.message ||
            "Failed to remove product from wishlist."
        );

        throw err;
      } finally {
        setWishlistActionId(null);
      }
    },
    [requireLogin, fetchWishlist]
  );

  // =====================================================
  // Notify seller about an already-wishlisted product
  // =====================================================

  const notifySellerForProduct = useCallback(
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
        setWishlistActionId(productId);
        setError("");

        const response =
          await notifySellerApi(productId);

        await fetchWishlist();

        return response;
      } catch (err) {
        console.error(
          "Notify seller error:",
          err
        );

        setError(
          err?.message ||
            "Failed to notify seller."
        );

        throw err;
      } finally {
        setWishlistActionId(null);
      }
    },
    [requireLogin, fetchWishlist]
  );

  // =====================================================
  // Clear error
  // =====================================================

  const clearWishlistError = useCallback(() => {
    setError("");
  }, []);

  // =====================================================
  // Context value
  // =====================================================

  const value = useMemo(
    () => ({
      // Wishlist
      items,

      // Count
      totalItems: items.length,

      // Loading
      loading,

      // Per-product action loading state
      wishlistActionId,

      // Error
      error,

      // Helpers
      isWishlisted,

      // Operations
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      notifySellerForProduct,
      clearWishlistError,
    }),
    [
      items,
      loading,
      wishlistActionId,
      error,
      isWishlisted,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      notifySellerForProduct,
      clearWishlistError,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// =====================================================
// Hook
// =====================================================

export function useWishlistContext() {
  const context = useContext(
    WishlistContext
  );

  if (!context) {
    throw new Error(
      "useWishlistContext must be used inside WishlistContextProvider."
    );
  }

  return context;
}