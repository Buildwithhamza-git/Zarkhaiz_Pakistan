import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Camera,
  Flag,
  Loader2,
  MessageSquare,
  Search,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";
import Button from "../../../shared/components/ui/button";

import {
  getAdminReviews,
  getReportedReviews,
  getAdminReviewStats,
  setReviewStatus,
  adminDeleteReview,
} from "../../review/api/reviewApi";
import StarRating from "../../review/components/StarRating";

const PAGE_SIZE = 10;

const STAT_CARDS = [
  { key: "total", label: "Total Reviews", classes: "bg-gray-50 text-gray-700" },
  { key: "averageRating", label: "Average Rating", classes: "bg-green-50 text-green-700" },
  { key: "pending", label: "Pending", classes: "bg-yellow-50 text-yellow-700" },
  { key: "reported", label: "Reported", classes: "bg-red-50 text-red-700" },
  { key: "approved", label: "Approved", classes: "bg-emerald-50 text-emerald-700" },
  { key: "hidden", label: "Hidden", classes: "bg-gray-100 text-gray-500" },
];

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Hidden", value: "hidden" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_META = {
  pending: { label: "Pending", classes: "bg-yellow-50 text-yellow-700" },
  approved: { label: "Approved", classes: "bg-emerald-50 text-emerald-700" },
  hidden: { label: "Hidden", classes: "bg-gray-100 text-gray-600" },
  rejected: { label: "Rejected", classes: "bg-red-50 text-red-700" },
};

const getStatusMeta = (status) =>
  STATUS_META[status] || STATUS_META.pending;

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminReviewsPage() {
  const [mode, setMode] = useState("all"); // "all" | "reported"
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      try {
        const response = await getAdminReviewStats();
        if (mounted) setStats(response?.data || null);
      } catch {
        if (mounted) setStats(null);
      }
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        let response;

        if (mode === "reported") {
          response = await getReportedReviews({
            page,
            limit: PAGE_SIZE,
          });
        } else {
          response = await getAdminReviews({
            page,
            limit: PAGE_SIZE,
            ...(status ? { status } : {}),
            ...(search.trim() ? { search: search.trim() } : {}),
          });
        }

        if (!mounted) return;

        const data = response?.data || {};

        setReviews(Array.isArray(data.items) ? data.items : []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (mounted) {
          setError(err?.message || "Failed to load reviews.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [mode, status, search, page]);

  const customerName = (review) => {
    const user = review?.user;

    if (user?.firstname || user?.lastname) {
      return `${user.firstname || ""} ${user.lastname || ""}`.trim();
    }

    return user?.email || "Customer";
  };

  const getProduct = (review) => review?.product || {};
  const getProductName = (review) => getProduct(review).name || "Product";

  const handleStatus = async (reviewId, nextStatus) => {
    setUpdatingId(reviewId);

    try {
      const response = await setReviewStatus(reviewId, nextStatus);

      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? { ...review, ...(response?.data?.review || {}), status: nextStatus }
            : review
        )
      );

      toast.success(`Review marked as ${nextStatus}.`);
    } catch (err) {
      toast.error(err?.message || "Failed to update review status.");
    } finally {
      setUpdatingId("");
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm("Delete this review permanently?")) return;

    setUpdatingId(review._id);

    try {
      await adminDeleteReview(review._id);

      setReviews((prev) => prev.filter((r) => r._id !== review._id));

      toast.success("Review deleted.");
    } catch (err) {
      toast.error(err?.message || "Failed to delete review.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <Container className="px-4 py-10 sm:px-6 sm:py-14">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Review Moderation
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review, approve, hide or remove customer reviews.
            </p>
          </div>

          {/* Analytics cards */}
          {stats && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {STAT_CARDS.map((card) => (
                <div
                  key={card.key}
                  className={`rounded-2xl border border-gray-100 p-4 shadow-sm ${card.classes}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                    {card.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {card.key === "averageRating"
                      ? (stats.averageRating || 0).toFixed(1)
                      : stats[card.key] ?? 0}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Mode toggle + filters */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode("all");
                  setPage(1);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "all"
                    ? "bg-green-700 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                All Reviews
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("reported");
                  setPage(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "reported"
                    ? "bg-red-600 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <Flag size={14} />
                Reported
              </button>
            </div>

            {mode === "all" && (
              <div className="flex flex-wrap items-center gap-2">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={() => {
                      setStatus(filter.value);
                      setPage(1);
                    }}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      status === filter.value
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}

                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search..."
                    className="w-48 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Reviews table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={28} className="animate-spin text-green-700" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MessageSquare size={36} className="text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">
                  No reviews found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-3.5 font-semibold">Review</th>
                      <th className="px-5 py-3.5 font-semibold">Product</th>
                      <th className="px-5 py-3.5 font-semibold">Customer</th>
                      <th className="px-5 py-3.5 font-semibold">Rating</th>
                      <th className="px-5 py-3.5 font-semibold">Status</th>
                      <th className="px-5 py-3.5 font-semibold">Reported</th>
                      <th className="px-5 py-3.5 font-semibold">Date</th>
                      <th className="px-5 py-3.5 font-semibold">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {reviews.map((review) => {
                      const meta = getStatusMeta(review.status);
                      const isUpdating = updatingId === review._id;
                      const reportedCount = Array.isArray(review.reportUsers)
                        ? review.reportUsers.length
                        : 0;

                      return (
                        <tr
                          key={review._id}
                          className="transition hover:bg-gray-50/60"
                        >
                          <td className="max-w-80 px-5 py-4">
                            <p className="line-clamp-2 text-gray-600">
                              {review.description || review.comment}
                            </p>
                            {Array.isArray(review.images) &&
                              review.images.length > 0 && (
                                <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                                  <Camera size={11} />
                                  {review.images.length} photo
                                  {review.images.length > 1 ? "s" : ""}
                                </p>
                              )}
                          </td>

                          <td className="px-5 py-4 font-semibold text-gray-900">
                            {getProductName(review)}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {customerName(review)}
                          </td>

                          <td className="px-5 py-4">
                            <StarRating rating={review.rating} size={13} />
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${meta.classes}`}
                            >
                              {meta.label}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {reportedCount > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                                <Flag size={11} />
                                {reportedCount}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              {review.status !== "approved" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={isUpdating}
                                  leftIcon={<ShieldCheck size={14} />}
                                  onClick={() =>
                                    handleStatus(review._id, "approved")
                                  }
                                >
                                  Approve
                                </Button>
                              )}

                              {review.status !== "hidden" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleStatus(review._id, "hidden")
                                  }
                                >
                                  Hide
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isUpdating}
                                onClick={() => handleDelete(review)}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 border-t border-gray-100 px-4 py-4">
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
          </div>
        </Container>
      </main>
    </div>
  );
}
