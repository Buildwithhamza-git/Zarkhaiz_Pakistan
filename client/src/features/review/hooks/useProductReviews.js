import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getProductReviews,
  getProductReviewSummary,
  createReview,
  updateReview,
  deleteReview,
  getReviewEligibility,
  toggleHelpful,
  reportReview,
} from "../api/reviewApi";

const EMPTY_STATS = {
  averageRating: 0,
  totalReviews: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export default function useProductReviews(productId, currentUserId = null) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [photos, setPhotos] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [sort, setSort] = useState("newest");
  const [rating, setRating] = useState("");
  const [search, setSearch] = useState("");
  const [withImages, setWithImages] = useState(false);
  const [verified, setVerified] = useState(false);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [eligibility, setEligibility] = useState(null);

  // ==========================================
  // Fetch reviews for the product
  // ==========================================

  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError("");

      const params = { page, limit: 10, sort };

      if (rating) params.rating = rating;
      if (search.trim()) params.search = search.trim();
      if (withImages) params.withImages = "true";
      if (verified) params.verified = "true";

      const response = await getProductReviews(productId, params);

      const data = response?.data || response || {};

      setReviews(Array.isArray(data.items) ? data.items : []);
      setStats(data.stats || EMPTY_STATS);
      setPagination(
        data.pagination || {
          page,
          limit: 10,
          total: 0,
          totalPages: 0,
        }
      );
    } catch (err) {
      console.error("Fetch reviews error:", err);
      setError(err?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [productId, page, sort, rating, search, withImages, verified]);

  // ==========================================
  // Fetch product summary + photo gallery
  // ==========================================

  const fetchSummary = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await getProductReviewSummary(productId);

      const data = response?.data || {};

      if (data.stats) setStats(data.stats);
      if (Array.isArray(data.photos)) setPhotos(data.photos);
    } catch (err) {
      console.error("Fetch review summary error:", err);
    }
  }, [productId]);

  // ==========================================
  // Fetch eligibility (whether current user
  // can review this product)
  // ==========================================

  const fetchEligibility = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await getReviewEligibility(productId);
      setEligibility(response?.data || null);
    } catch (err) {
      console.error("Fetch review eligibility error:", err);
      setEligibility(null);
    }
  }, [productId]);

  // ==========================================
  // Initial load
  // ==========================================

  useEffect(() => {
    fetchReviews();
    fetchSummary();
  }, [fetchReviews, fetchSummary]);

  // ==========================================
  // Filter/sort helpers
  // ==========================================

  const changeFilters = useCallback((next) => {
    if (next.sort !== undefined) setSort(next.sort);
    if (next.rating !== undefined) setRating(next.rating);
    if (next.search !== undefined) setSearch(next.search);
    if (next.withImages !== undefined) setWithImages(next.withImages);
    if (next.verified !== undefined) setVerified(next.verified);

    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSort("newest");
    setRating("");
    setSearch("");
    setWithImages(false);
    setVerified(false);
    setPage(1);
  }, []);

  const activeFilterCount = useMemo(
    () =>
      [rating ? 1 : 0, withImages ? 1 : 0, verified ? 1 : 0].reduce(
        (sum, value) => sum + value,
        0
      ),
    [rating, withImages, verified]
  );

  // ==========================================
  // Submit (create) a review
  // ==========================================

  const submitReview = async (payload, images = []) => {
    setSubmitting(true);

    try {
      await createReview({ productId, ...payload }, images);
      await Promise.all([fetchReviews(), fetchSummary(), fetchEligibility()]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to submit review.",
      };
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Edit (update) a review
  // ==========================================

  const editReview = async (reviewId, payload, images = []) => {
    setSubmitting(true);

    try {
      await updateReview(reviewId, payload, images);
      await Promise.all([fetchReviews(), fetchSummary(), fetchEligibility()]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to update review.",
      };
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Remove (delete) a review
  // ==========================================

  const removeReview = async (reviewId) => {
    setSubmitting(true);

    try {
      await deleteReview(reviewId);
      await Promise.all([fetchReviews(), fetchSummary(), fetchEligibility()]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to delete review.",
      };
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Toggle helpful on a review (local update)
  // ==========================================

  const applyHelpfulUsers = (review, makeHelpful) => {
    if (!currentUserId) return review.helpfulUsers || [];

    const currentUserIdStr = String(currentUserId);

    if (makeHelpful) {
      return Array.from(
        new Set([...(review.helpfulUsers || []), currentUserIdStr])
      );
    }

    return (review.helpfulUsers || []).filter(
      (id) => id?.toString() !== currentUserIdStr
    );
  };

  const toggleHelpfulLocal = async (reviewId, currentHelpful) => {
    const optimistic = currentHelpful ? -1 : 1;

    setReviews((prev) =>
      prev.map((review) =>
        review._id === reviewId
          ? {
              ...review,
              helpfulCount: Math.max(
                0,
                (review.helpfulCount || 0) + optimistic
              ),
              helpfulUsers: applyHelpfulUsers(review, !currentHelpful),
            }
          : review
      )
    );

    try {
      const response = await toggleHelpful(reviewId);

      const data = response?.data || {};

      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                helpfulCount: data.helpfulCount ?? review.helpfulCount,
                helpfulUsers: applyHelpfulUsers(
                  review,
                  Boolean(data.helpful)
                ),
              }
            : review
        )
      );

      return { success: true, helpful: data.helpful };
    } catch (err) {
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                helpfulCount: Math.max(
                  0,
                  (review.helpfulCount || 0) - optimistic
                ),
                helpfulUsers: applyHelpfulUsers(review, currentHelpful),
              }
            : review
        )
      );

      return {
        success: false,
        message: err?.message || "Failed to update review.",
      };
    }
  };

  // ==========================================
  // Report a review
  // ==========================================

  const reportLocal = async (reviewId, reason = "") => {
    try {
      await reportReview(reviewId, reason);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to report review.",
      };
    }
  };

  return {
    reviews,
    stats,
    photos,
    pagination,
    loading,
    error,
    submitting,
    eligibility,
    filters: { sort, rating, search, withImages, verified, page },
    activeFilterCount,
    changeFilters,
    resetFilters,
    setPage,
    fetchReviews,
    fetchSummary,
    fetchEligibility,
    submitReview,
    editReview,
    removeReview,
    toggleHelpfulLocal,
    reportLocal,
  };
}
