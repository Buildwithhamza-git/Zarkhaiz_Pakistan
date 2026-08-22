import { authFetch } from "../../../utlis/authFetch";

// ==========================================
// GET CART
// ==========================================

export const getCart = async () => {
  return await authFetch("/cart");
};


// ==========================================
// ADD ITEM
// ==========================================

export const addToCart = async (
  productId,
  quantity = 1
) => {
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
    ) ||
    numericQuantity < 1
  ) {
    throw new Error(
      "Quantity must be at least 1."
    );
  }

  return await authFetch(
    "/cart/items",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        productId,
        quantity:
          numericQuantity,
      }),
    }
  );
};


// ==========================================
// UPDATE ITEM
// ==========================================

export const updateCartItem = async (
  productId,
  quantity
) => {
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
    ) ||
    numericQuantity < 1
  ) {
    throw new Error(
      "Quantity must be at least 1."
    );
  }

  return await authFetch(
    `/cart/items/${productId}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        quantity:
          numericQuantity,
      }),
    }
  );
};


// ==========================================
// REMOVE ITEM
// ==========================================

export const removeCartItem = async (
  productId
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  return await authFetch(
    `/cart/items/${productId}`,
    {
      method: "DELETE",
    }
  );
};


// ==========================================
// CLEAR CART
// ==========================================

export const clearCart = async () => {
  return await authFetch(
    "/cart",
    {
      method: "DELETE",
    }
  );
};