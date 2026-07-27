import { authFetch } from "../../../utlis/authFetch";

// ======================================
// PRODUCTS
// ======================================

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      query.append(key, value);
    }
  });

  return await authFetch(`/products?${query.toString()}`);
};

export const getProduct = async (id) => {
  return await authFetch(`/products/${id}`);
};


// ======================================
// CATEGORIES
// ======================================

// ✅ Get all categories (tree)
export const getCategories = async () => {
  return await authFetch("/categories");
};

// 🔥 NEW: Get category by slug
export const getCategoryBySlug = async (slug) => {
  return await authFetch(`/categories/slug/${slug}`);
};


// ======================================
// OPTIONAL HELPERS (VERY USEFUL)
// ======================================

// 🔥 Build category URL
export const getCategoryUrl = (slug) => {
  return `/category/${slug}`;
};