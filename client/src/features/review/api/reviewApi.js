import { authFetch } from "../../../utlis/authFetch";

// ==========================================
// GET PRODUCT REVIEWS (public)
// ==========================================

export const getProductReviews = async (productId, params = {}) => {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  const query = new URLSearchParams(params).toString();

  return await authFetch(
    `/reviews/product/${productId}${query ? `?${query}` : ""}`
  );
};

// ==========================================
// GET PRODUCT REVIEW SUMMARY + PHOTOS (public)
// ==========================================

export const getProductReviewSummary = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  return await authFetch(`/reviews/product/${productId}/summary`);
};

// ==========================================
// GET REVIEW ELIGIBILITY
// ==========================================

export const getReviewEligibility = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  return await authFetch(`/reviews/eligibility/${productId}`);
};

// ==========================================
// Build a FormData payload for review create/update
// ==========================================

const buildReviewFormData = (payload = {}, images = []) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    formData.append(key, value);
  });

  const newFiles = images.filter((image) => image instanceof File);

  const existingImages = images.filter((image) => !(image instanceof File));

  newFiles.forEach((file) => formData.append("images", file));

  if (existingImages.length) {
    formData.append("existingImages", JSON.stringify(existingImages));
  }

  return formData;
};

// ==========================================
// CREATE REVIEW (multipart: images)
// ==========================================

export const createReview = async (payload = {}, images = []) => {
  if (!payload?.productId) {
    throw new Error("Product ID is required.");
  }

  return await authFetch("/reviews", {
    method: "POST",
    body: buildReviewFormData(payload, images),
  });
};

// ==========================================
// UPDATE REVIEW (multipart: images)
// ==========================================

export const updateReview = async (reviewId, payload = {}, images = []) => {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }

  return await authFetch(`/reviews/${reviewId}`, {
    method: "PATCH",
    body: buildReviewFormData(payload, images),
  });
};

// ==========================================
// DELETE REVIEW
// ==========================================

export const deleteReview = async (reviewId) => {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }

  return await authFetch(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
};

// ==========================================
// GET MY REVIEWS
// ==========================================

export const getMyReviews = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return await authFetch(
    `/reviews/my-reviews${query ? `?${query}` : ""}`
  );
};

// ==========================================
// TOGGLE HELPFUL
// ==========================================

export const toggleHelpful = async (reviewId) => {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }

  return await authFetch(`/reviews/${reviewId}/helpful`, {
    method: "POST",
  });
};

// ==========================================
// REPORT REVIEW
// ==========================================

export const reportReview = async (reviewId, reason = "") => {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }

  return await authFetch(`/reviews/${reviewId}/report`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
};

// ==========================================
// GET REVIEWS RECEIVED BY CURRENT SELLER
// ==========================================

export const getSellerReviews = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return await authFetch(
    `/reviews/seller/reviews${query ? `?${query}` : ""}`
  );
};

// ==========================================
// GET SELLER PRODUCTS (for review filter)
// ==========================================

export const getSellerProducts = async () => {
  return await authFetch("/reviews/seller/products");
};

// ==========================================
// GET SELLER REVIEW STATS + ANALYTICS
// ==========================================

export const getSellerReviewStats = async () => {
  return await authFetch("/reviews/seller/stats");
};

// ==========================================
// GET SINGLE REVIEW (seller)
// ==========================================

export const getSellerReviewDetail = async (reviewId) => {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }

  return await authFetch(`/reviews/seller/${reviewId}`);
};

// ==========================================
// REPLY TO A REVIEW (seller)
// ==========================================

export const replyToReview = async (reviewId, reply) => {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }

  if (!reply?.trim()) {
    throw new Error("Reply cannot be empty.");
  }

  return await authFetch(`/reviews/${reviewId}/reply`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ reply: reply.trim() }),
  });
};

// ==========================================
// ADMIN: GET ALL REVIEWS
// ==========================================

export const getAdminReviews = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return await authFetch(
    `/reviews/admin/reviews${query ? `?${query}` : ""}`
  );
};

// ==========================================
// ADMIN: GET REPORTED REVIEWS
// ==========================================

export const getReportedReviews = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return await authFetch(
    `/reviews/admin/reported${query ? `?${query}` : ""}`
  );
};

// ==========================================
// ADMIN: GET REVIEW MODERATION STATS
// ==========================================

export const getAdminReviewStats = async () => {
  return await authFetch("/reviews/admin/stats");
};

// ==========================================
// ADMIN: SET REVIEW STATUS
// ==========================================

export const setReviewStatus = async (reviewId, status) => {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }

  return await authFetch(`/reviews/admin/${reviewId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// ==========================================
// ADMIN: DELETE REVIEW
// ==========================================

export const adminDeleteReview = async (reviewId) => {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }

  return await authFetch(`/reviews/admin/${reviewId}`, {
    method: "DELETE",
  });
};
