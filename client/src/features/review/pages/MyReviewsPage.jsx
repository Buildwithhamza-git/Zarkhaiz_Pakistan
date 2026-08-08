import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  ChevronRight,
  MessageSquare,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";
import Loader from "../../../shared/components/ui/Loader";
import Button from "../../../shared/components/ui/button";
import Modal from "../../../shared/components/ui/Modal";

import { getMyReviews, updateReview, deleteReview } from "../api/reviewApi";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";

const PAGE_SIZE = 10;

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // Fetch my reviews
  // ==========================================

  const fetchMyReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyReviews({ page, limit: PAGE_SIZE });
      const data = response?.data || response || {};

      setReviews(Array.isArray(data.items) ? data.items : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Fetch my reviews error:", err);
      setError(err?.message || "Failed to load your reviews.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMyReviews();
  }, [fetchMyReviews]);

  // ==========================================
  // Update review
  // ==========================================

  const handleUpdate = async (payload, images) => {
    setSubmitting(true);

    try {
      await updateReview(editing._id, payload, images);
      toast.success("Review updated successfully!");
      setEditing(null);
      await fetchMyReviews();
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
  // Delete review
  // ==========================================

  const handleDelete = async () => {
    if (!deleting) return;

    setSubmitting(true);

    try {
      await deleteReview(deleting._id);
      toast.success("Review deleted.");
      setDeleting(null);
      await fetchMyReviews();
    } catch (err) {
      toast.error(err?.message || "Failed to delete review.");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Product helpers
  // ==========================================

  const getProduct = (review) => review?.product || {};
  const getProductName = (review) => getProduct(review).name || "Product";
  const getProductImage = (review) => {
    const product = getProduct(review);
    const images = Array.isArray(product.images) ? product.images : [];
    const first = images[0];

    if (typeof first === "string") return first;

    return (
      first?.url ||
      "https://placehold.co/400x400?text=No+Image"
    );
  };
  const getProductId = (review) =>
    getProduct(review)?._id || getProduct(review)?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============ NAVBAR ============ */}
      <Navbar />

      <main>
        <Container className="px-4 py-10 sm:px-6 sm:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-green-700">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link
              to="/profile"
              className="transition hover:text-green-700"
            >
              Profile
            </Link>
            <ChevronRight size={14} />
            <span className="font-medium text-gray-700">My Reviews</span>
          </nav>

          {/* Header */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100">
              <Star size={22} className="text-yellow-500" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Reviews
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage the reviews you have written
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Content */}
          <div className="mt-6">
            {loading ? (
              <Loader text="Loading your reviews..." />
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                <MessageSquare size={40} className="text-gray-300" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  No reviews yet
                </h3>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Review products you've bought to help other farmers
                  make better choices.
                </p>

                <Link
                  to="/orders"
                  className="mt-6 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  View My Orders
                </Link>
              </div>
            ) : (
              <>
                <div className="review-scroll max-h-[600px] space-y-4 overflow-y-auto overscroll-contain pr-1">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row"
                    >
                      {/* Product */}
                      <Link
                        to={
                          getProductId(review)
                            ? `/products/product/${getProductId(review)}`
                            : "/products"
                        }
                        className="flex shrink-0 items-center gap-3 sm:w-64"
                      >
                        <img
                          src={getProductImage(review)}
                          alt={getProductName(review)}
                          className="h-16 w-16 rounded-xl border border-gray-200 object-cover"
                        />

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-green-700">
                            {getProductName(review)}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </Link>

                      {/* Review */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <StarRating rating={review.rating} />
                            <span className="text-sm font-semibold text-gray-700">
                              {review.rating}.0
                            </span>

                            {review.isVerifiedPurchase && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                <BadgeCheck size={12} />
                                Verified Purchase
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditing(review)}
                              leftIcon={<Pencil size={15} />}
                            >
                              Edit
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleting(review)}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              leftIcon={<Trash2 size={15} />}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {review.title && (
                          <h4 className="mt-2 font-semibold text-gray-900">
                            {review.title}
                          </h4>
                        )}

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          {review.description || review.comment}
                        </p>

                        {/* Review images */}
                        {Array.isArray(review.images) &&
                          review.images.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {review.images.map((image, index) => (
                                <a
                                  key={index}
                                  href={image}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block h-16 w-16 overflow-hidden rounded-lg border border-gray-200"
                                >
                                  <img
                                    src={image}
                                    alt="Review attachment"
                                    className="h-full w-full object-cover"
                                  />
                                </a>
                              ))}
                            </div>
                          )}

                        {review.sellerReply && (
                          <div className="mt-3 rounded-xl border border-green-100 bg-green-50/60 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                              Seller's Response
                            </p>
                            <p className="mt-1 text-sm leading-6 text-gray-700">
                              {review.sellerReply}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </Container>
      </main>

      {/* ============ EDIT MODAL ============ */}
      <ReviewForm
        open={!!editing}
        onClose={() => setEditing(null)}
        productName={getProductName(editing)}
        productImage={getProductImage(editing)}
        mode="edit"
        initialData={editing}
        submitting={submitting}
        onSubmit={handleUpdate}
      />

      {/* ============ DELETE CONFIRMATION ============ */}
      {deleting && (
        <Modal
          isOpen={!!deleting}
          onClose={() => setDeleting(null)}
          title="Delete Review"
          size="sm"
        >
          <p className="text-sm text-gray-600">
            Are you sure you want to delete your review for{" "}
            <span className="font-semibold text-gray-900">
              {getProductName(deleting)}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Cancel
            </Button>

            <Button
              variant="danger"
              loading={submitting}
              onClick={handleDelete}
            >
              Delete Review
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
