import { authFetch } from "../../../utlis/authFetch";

// ======================================
// GET ALL PRODUCTS (FILTERED / PAGINATED)
// ======================================

export const getProducts = async (params = {}, signal) => {
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

  const queryString = query.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ""}`;

  return await authFetch(endpoint, { signal });
};

// ======================================
// GET SINGLE PRODUCT BY ID
// ======================================

export const getProduct = async (id, signal) => {
  if (!id) {
    throw new Error("Product ID is required.");
  }

  return await authFetch(`/products/${id}`, { signal });
};

// ======================================
// GET CATEGORIES
// ======================================

export const getCategories = async (signal) => {
  return await authFetch("/categories", { signal });
};

// ======================================
// GET CATEGORY BY SLUG
// ======================================

export const getCategoryBySlug = async (slug, signal) => {
  if (!slug) {
    throw new Error("Category slug is required.");
  }

  return await authFetch(`/categories/slug/${slug}`, { signal });
};

// ======================================
// HELPERS
// ======================================

export const getCategoryUrl = (slug) => {
  if (!slug) {
    return "/products";
  }

  return `/products?category=${encodeURIComponent(slug)}`;
};