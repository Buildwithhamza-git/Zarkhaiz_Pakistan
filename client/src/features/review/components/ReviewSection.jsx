import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  Pencil,
  Search,
  Star,
  X,
} from "lucide-react";

import { useAuthContext } from "../../../context/authContext";
import useProductReviews from "../hooks/useProductReviews";

import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import ReviewSummary from "./ReviewSummary";
import ReviewPhotos from "./ReviewPhotos";
import Button from "../../../shared/components/ui/button";
import Modal from "../../../shared/components/ui/Modal";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest rating" },
  { value: "lowest", label: "Lowest rating" },
  { value: "helpful", label: "Most helpful" },
];

export default function ReviewSection({
  productId,
  productName = "",
  productImage = "",
}) {
  const { token, user } = useAuthContext();

  const currentUserId = user?._id || user?.id;

  const {
    reviews,
    stats,
    photos,
    pagination,
    loading,
    error,
    submitting,
    eligibility,
    filters,
    activeFilterCount,
    changeFilters,
    resetFilters,
    setPage,
    fetchEligibility,
    submitReview,
    editReview,
    removeReview,
    toggleHelpfulLocal,
    reportLocal,
  } = useProductReviews(productId, currentUserId);

  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [writeOpen, setWriteOpen] = useState(false);

  // ==========================================
  // Fetch review eligibility for logged-in users
  // ==========================================

  useEffect(() => {
    if (token) {
      fetchEligibility();
    }
  }, [token, fetchEligibility]);

  // ==========================================
  // Create submit (product page)
  // ==========================================

  const handleCreateSubmit = async (payload, images) => {
    const result = await submitReview(payload, images);

    if (result.success) {
      toast.success("Review submitted. Thank you!");
      setWriteOpen(false);
    }

    return result;
  };

  // ==========================================
  // Edit submit
  // ==========================================

  const handleEditSubmit = async (payload, images) => {
    const result = await editReview(editTarget._id, payload, images);
    if (result.success) toast.success("Review updated successfully!");
    return result;
  };

  // ==========================================
  // Delete review
  // ==========================================

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget._id);

    const result = await removeReview(deleteTarget._id);

    setDeletingId(null);
    setDeleteTarget(null);

    if (result.success) {
      toast.success("Review deleted.");
    } else {
      toast.error(result.message);
    }
  };

  const chip = (active, onClick, children) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5
        text-xs font-semibold transition ${
          active
            ? "border-green-600 bg-green-50 text-green-700"
            : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-700"
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <section id="reviews" className="mt-12">
      {/* ============ HEADER ============ */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Star size={22} className="fill-yellow-400 text-yellow-400" />
          <h2 className="text-2xl font-bold text-gray-900">
            Ratings & Reviews
          </h2>

          {stats?.totalReviews > 0 && (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
              {stats.totalReviews}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600"
          >
            <X size={14} />
            Clear filters ({activeFilterCount})
          </button>
        )}

        {token && eligibility?.canReview && (
          <Button
            leftIcon={<Star size={15} />}
            onClick={() => setWriteOpen(true)}
          >
            Write a Review
          </Button>
        )}

        {token && eligibility?.alreadyReviewed && eligibility?.existingReview && (
          <Button
            variant="outline"
            leftIcon={<Pencil size={15} />}
            onClick={() => setEditTarget(eligibility.existingReview)}
          >
            Edit Your Review
          </Button>
        )}
      </div>

      {/* ============ SUMMARY ============ */}
      {stats?.totalReviews > 0 && (
        <div className="mb-5">
          <ReviewSummary
            stats={stats}
            selectedRating={filters.rating}
            onSelectRating={(value) => changeFilters({ rating: value })}
          />
        </div>
      )}

      {/* ============ MY REVIEW BANNER ============ */}
      {token && eligibility?.alreadyReviewed && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          You have reviewed this product. You can edit or delete your
          review below.
        </div>
      )}

      {token && eligibility?.canReview && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <BadgeCheck size={15} />
            Your order has been delivered!
          </span>{" "}
          Share your experience with other buyers.
        </div>
      )}

      {token && eligibility && !eligibility.alreadyReviewed && !eligibility.canReview && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
            <BadgeCheck size={15} />
            Verified Purchase Reviews
          </span>{" "}
          Purchased this product? Write your review from{" "}
          <Link
            to="/orders"
            className="font-semibold text-green-700 underline-offset-2 hover:underline"
          >
            My Orders
          </Link>{" "}
          once your order is delivered.
        </div>
      )}

      {!token && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Write a review after purchasing from{" "}
          <Link
            to="/orders"
            className="font-semibold text-green-700 underline-offset-2 hover:underline"
          >
            My Orders
          </Link>
          .
        </div>
      )}

      {/* ============ FILTER BAR ============ */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {chip(
            filters.withImages,
            () => changeFilters({ withImages: !filters.withImages }),
            <>With photos</>
          )}

          {chip(
            filters.verified,
            () => changeFilters({ verified: !filters.verified }),
            <>Verified purchase</>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={filters.search}
              onChange={(e) => changeFilters({ search: e.target.value })}
              placeholder="Search reviews..."
              className="w-52 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <select
            value={filters.sort}
            onChange={(e) => changeFilters({ sort: e.target.value })}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ============ PHOTO GALLERY ============ */}
      <div className="mb-5">
        <ReviewPhotos photos={photos} />
      </div>

      {/* ============ REVIEWS ============ */}
      <ReviewList
        reviews={reviews}
        loading={loading}
        error={error}
        currentUserId={currentUserId}
        onHelpful={toggleHelpfulLocal}
        onReport={reportLocal}
        onEdit={setEditTarget}
        onDelete={setDeleteTarget}
        deletingId={deletingId}
      />

      {/* ============ PAGINATION ============ */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4">
          <button
            type="button"
            disabled={filters.page <= 1}
            onClick={() => setPage(filters.page - 1)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {filters.page} of {pagination.totalPages}
          </span>

          <button
            type="button"
            disabled={filters.page >= pagination.totalPages}
            onClick={() => setPage(filters.page + 1)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* ============ WRITE REVIEW MODAL ============ */}
      <ReviewForm
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        productName={productName}
        productImage={productImage}
        mode="create"
        submitting={submitting}
        onSubmit={handleCreateSubmit}
      />

      {/* ============ EDIT FORM MODAL ============ */}
      <ReviewForm
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        productName={productName}
        productImage={productImage}
        mode="edit"
        initialData={editTarget}
        submitting={submitting}
        onSubmit={handleEditSubmit}
      />

      {/* ============ DELETE CONFIRMATION ============ */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Review"
          size="sm"
        >
          <p className="text-sm text-gray-600">
            Are you sure you want to delete your review? This action
            cannot be undone.
          </p>

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>

            <Button
              variant="danger"
              loading={deletingId === deleteTarget._id}
              onClick={handleDelete}
            >
              Delete Review
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
