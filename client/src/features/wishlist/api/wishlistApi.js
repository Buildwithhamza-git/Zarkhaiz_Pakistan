import { authFetch } from "../../../utlis/authFetch";

// ==========================================
// GET WISHLIST
// ==========================================

export const getWishlist = async () => {
  return await authFetch("/wishlist");
};

// ==========================================
// ADD TO WISHLIST
// ==========================================

export const addToWishlist = async (
  productId,
  notifySeller = false
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  return await authFetch(
    "/wishlist",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        productId,
        notifySeller: Boolean(notifySeller),
      }),
    }
  );
};

// ==========================================
// SELLER WISHLIST STATS (buyer interest)
// ==========================================

export const getSellerWishlistStats = async () => {
  return await authFetch("/wishlist/seller-stats");
};

// ==========================================
// REMOVE FROM WISHLIST
// ==========================================

export const removeFromWishlist = async (
  productId
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  return await authFetch(
    `/wishlist/${productId}`,
    {
      method: "DELETE",
    }
  );
};

// ==========================================
// NOTIFY SELLER
// ==========================================

export const notifySellerForProduct = async (
  productId
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  return await authFetch(
    `/wishlist/${productId}/notify`,
    {
      method: "POST",
    }
  );
};