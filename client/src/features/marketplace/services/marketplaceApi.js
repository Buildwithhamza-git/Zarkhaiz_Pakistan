import { authFetch } from "../../../utlis/authFetch";

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

export const getCategories = async () => {
  return await authFetch("/categories");
};

export const getProduct = async (id) => {
  return await authFetch(`/products/${id}`);
};