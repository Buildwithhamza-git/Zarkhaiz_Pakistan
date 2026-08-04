import { formatPKR } from "../../marketplace/utils/productDisplay";

export const ORDER_STATUS_META = {
  pending: { label: "Pending", color: "yellow" },
  processing: { label: "Processing", color: "blue" },
  shipped: { label: "Shipped", color: "purple" },
  delivered: { label: "Delivered", color: "green" },
  cancelled: { label: "Cancelled", color: "red" },
};

export const PAYMENT_STATUS_META = {
  pending: { label: "Pending", color: "yellow" },
  paid: { label: "Paid", color: "green" },
  failed: { label: "Failed", color: "red" },
  refunded: { label: "Refunded", color: "gray" },
};

export const getOrderStatusMeta = (status) =>
  ORDER_STATUS_META[status] || { label: status || "Pending", color: "gray" };

export const getPaymentStatusMeta = (status) =>
  PAYMENT_STATUS_META[status] || {
    label: status || "Pending",
    color: "gray",
  };

export const formatMoney = (value) =>
  value == null ? "0" : `Rs. ${formatPKR(value)}`;

export const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getItemTotal = (item) =>
  Number(item?.price || 0) * Number(item?.quantity || 0);

export const getOrderSubtotal = (order) =>
  (order?.items || []).reduce((sum, item) => sum + getItemTotal(item), 0);
