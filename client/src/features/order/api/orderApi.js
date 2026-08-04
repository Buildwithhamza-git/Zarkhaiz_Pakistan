import { authFetch } from "../../../utlis/authFetch";

// ==========================================
// CREATE ORDER
// ==========================================

export const createOrder = async (payload) => {
  return await authFetch("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ==========================================
// MY ORDERS
// ==========================================

export const getMyOrders = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);

  const qs = query.toString();

  return await authFetch(`/orders/mine${qs ? `?${qs}` : ""}`);
};

// ==========================================
// ORDER DETAIL
// ==========================================

export const getOrderDetail = async (orderId) => {
  return await authFetch(`/orders/${orderId}`);
};

// ==========================================
// CANCEL ORDER
// ==========================================

export const cancelOrder = async (orderId) => {
  return await authFetch(`/orders/${orderId}/cancel`, {
    method: "POST",
  });
};

// ==========================================
// ADMIN: ALL ORDERS
// ==========================================

export const getAllOrders = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  if (params.orderStatus) query.set("orderStatus", params.orderStatus);

  const qs = query.toString();

  return await authFetch(`/orders${qs ? `?${qs}` : ""}`);
};

// ==========================================
// ADMIN: UPDATE ORDER STATUS
// ==========================================

export const updateOrderStatus = async (orderId, status) => {
  return await authFetch(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// ==========================================
// ADMIN: ORDER STATS
// ==========================================

export const getOrderStats = async () => {
  return await authFetch("/orders/stats");
};

// ==========================================
// SELLER: ORDERS
// ==========================================

export const getSellerOrders = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  if (params.orderStatus) query.set("orderStatus", params.orderStatus);

  const qs = query.toString();

  return await authFetch(`/orders/seller${qs ? `?${qs}` : ""}`);
};

// ==========================================
// SELLER: ORDER STATS
// ==========================================

export const getSellerOrderStats = async () => {
  return await authFetch("/orders/seller/stats");
};

// ==========================================
// SELLER: UPDATE ORDER STATUS
// ==========================================

export const updateSellerOrderStatus = async (orderId, status) => {
  return await authFetch(`/orders/seller/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};
