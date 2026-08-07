import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  Camera,
  Loader2,
  MessageSquare,
  MessageSquareReply,
  Search,
  Send,
  Star,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useSellerContext } from "../../../context/sellerContext";

import Button from "../../../shared/components/ui/button";
import Modal from "../../../shared/components/ui/Modal";

import {
  getSellerReviews,
  getSellerProducts,
  getSellerReviewStats,
  replyToReview,
} from "../api/reviewApi";
import StarRating from "../components/StarRating";

const PAGE_SIZE = 10;

const RATING_OPTIONS = [
  { value: "", label: "All ratings" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars" },
  { value: "3", label: "3 stars" },
  { value: "2", label: "2 stars" },
  { value: "1", label: "1 star" },
];

const REPLIED_OPTIONS = [
  { value: "", label: "All replies" },
  { value: "true", label: "Replied" },
  { value: "false", label: "Not replied" },
];

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const StatsCard = ({ icon: Icon, label, value, accent }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-4">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
      >
        <Icon size={20} />
      </span>

      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function SellerReviewsPage() {
  const { isApproved } = useSellerContext();

  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");
  const [productId, setProductId] = useState("");
  const [withImages, setWithImages] = useState(false);
  const [replied, setReplied] = useState("");

  const [detailReview, setDetailReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = { page, limit: PAGE_SIZE };

      if (search.trim()) params.search = search.trim();
      if (rating) params.rating = rating;
      if (productId) params.productId = productId;
      if (withImages) params.withImages = "true";
      if (replied) params.replied = replied;

      const response = await getSellerReviews(params);

      const data = response?.data || {};

      setReviews(Array.isArray(data.items) ? data.items : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [page, search, rating, productId, withImages, replied]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [statsRes, productsRes] = await Promise.all([
        getSellerReviewStats(),
        getSellerProducts(),
      ]);

      setAnalytics(statsRes?.data || null);
      setProducts(Array.isArray(productsRes?.data) ? productsRes.data : []);
    } catch (err) {
      console.error("Failed to load review analytics:", err);
    }
  }, []);

  useEffect(() => {
    if (!isApproved) return;

    fetchReviews();
  }, [isApproved, fetchReviews]);

  useEffect(() => {
    if (!isApproved) return;

    fetchAnalytics();
  }, [isApproved, fetchAnalytics]);

  const openDetail = (review) => {
    setDetailReview(review);
    setReplyText(review?.sellerReply || "");
  };

  const handleSubmitReply = async () => {
    if (!detailReview || !replyText.trim()) return;

    setSubmitting(true);

    try {
      const response = await replyToReview(detailReview._id, replyText);
      const updated = response?.data?.review;

      setReviews((prev) =>
        prev.map((review) =>
          review._id === detailReview._id
            ? { ...review, ...(updated || {}) }
            : review
        )
      );

      setDetailReview((prev) => ({ ...prev, ...(updated || {}) }));

      toast.success("Reply posted successfully.");
    } catch (err) {
      toast.error(err?.message || "Failed to post reply.");
    } finally {
      setSubmitting(false);
    }
  };

  const customerName = (review) => {
    const user = review?.user;

    if (user?.firstname || user?.lastname) {
      return `${user.firstname || ""} ${user.lastname || ""}`.trim();
    }

    return user?.email || "Customer";
  };

  const getProduct = (review) => review?.product || {};
  const getProductName = (review) => getProduct(review).name || "Product";
  const getProductImage = (review) => {
    const product = getProduct(review);
    const images = Array.isArray(product.images) ? product.images : [];
    const first = images[0];

    if (typeof first === "string") return first;

    return first?.url || "https://placehold.co/400x400?text=No+Image";
  };

  if (!isApproved) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">
          You are not authorized to access this page.
        </p>
      </div>
    );
  }

  const stats = analytics?.stats || {};
  const distribution = analytics?.distribution || {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  const monthly = analytics?.monthly || [];
  const topProducts = analytics?.topProducts || [];
  const lowestProducts = analytics?.lowestProducts || [];

  const maxMonthly = Math.max(1, ...monthly.map((entry) => entry.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">
          Reviews your customers have left on your products.
        </p>
      </div>

      {/* ============ STATS ============ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Star}
          label="Average Rating"
          value={stats.averageRating ? `${stats.averageRating} / 5` : "—"}
          accent="bg-yellow-100 text-yellow-700"
        />
        <StatsCard
          icon={MessageSquare}
          label="Total Reviews"
          value={stats.totalReviews ?? "—"}
          accent="bg-blue-100 text-blue-700"
        />
        <StatsCard
          icon={ThumbsUp}
          label="Positive Reviews"
          value={
            stats.totalReviews
              ? `${stats.positivePercent ?? 0}%`
              : "—"
          }
          accent="bg-green-100 text-green-700"
        />
        <StatsCard
          icon={MessageSquareReply}
          label="Pending Replies"
          value={stats.pendingReplies ?? "—"}
          accent="bg-orange-100 text-orange-700"
        />
      </div>

      {/* ============ ANALYTICS ============ */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Distribution */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">
            Rating Distribution
          </h3>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const total = stats.totalReviews || 0;
              const percentage = total
                ? (distribution[star] / total) * 100
                : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-6 text-sm font-medium text-gray-600">
                    {star}★
                  </span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-8 text-right text-xs text-gray-400">
                    {distribution[star]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly reviews */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">
            Reviews Per Month
          </h3>

          <div className="flex h-40 items-end gap-3">
            {monthly.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet.</p>
            ) : (
              monthly.map((entry, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-semibold text-gray-700">
                    {entry.count > 0 ? entry.count : ""}
                  </span>

                  <div className="flex h-32 w-full items-end rounded-lg bg-gray-100">
                    <div
                      className="w-full rounded-lg bg-green-600 transition-all duration-300"
                      style={{
                        height: `${(entry.count / maxMonthly) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="text-[11px] text-gray-500">
                    {entry.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top rated products */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={17} className="text-green-600" />
            <h3 className="font-semibold text-gray-900">Top Rated Products</h3>
          </div>

          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={
                      product.image ||
                      "https://placehold.co/400x400?text=No+Image"
                    }
                    alt={product.name || "Product"}
                    className="h-11 w-11 shrink-0 rounded-lg border border-gray-200 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-gray-800">
                      {product.name || "Product"}
                    </p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={product.average} size={12} />
                      <span className="text-xs text-gray-400">
                        ({product.total} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lowest rated products */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingDown size={17} className="text-red-500" />
            <h3 className="font-semibold text-gray-900">
              Products Needing Attention
            </h3>
          </div>

          {lowestProducts.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {lowestProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={
                      product.image ||
                      "https://placehold.co/400x400?text=No+Image"
                    }
                    alt={product.name || "Product"}
                    className="h-11 w-11 shrink-0 rounded-lg border border-gray-200 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-gray-800">
                      {product.name || "Product"}
                    </p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={product.average} size={12} />
                      <span className="text-xs text-gray-400">
                        ({product.total} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ============ FILTERS ============ */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-52">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer or review..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
        >
          <option value="">All products</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name || "Product"}
            </option>
          ))}
        </select>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
        >
          {RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={replied}
          onChange={(e) => setReplied(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
        >
          {REPLIED_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setWithImages((prev) => !prev)}
          className={`
            inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2
            text-sm font-semibold transition ${
              withImages
                ? "border-green-600 bg-green-50 text-green-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-700"
            }
          `}
        >
          <Camera size={15} />
          With photos
        </button>
      </div>

      {/* ============ REVIEWS TABLE ============ */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-green-700" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare size={36} className="text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              No reviews found matching your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3.5 font-semibold">Product</th>
                  <th className="px-5 py-3.5 font-semibold">Customer</th>
                  <th className="px-5 py-3.5 font-semibold">Rating</th>
                  <th className="px-5 py-3.5 font-semibold">Review</th>
                  <th className="px-5 py-3.5 font-semibold">Reply</th>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {reviews.map((review) => (
                  <tr
                    key={review._id}
                    className="transition hover:bg-gray-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImage(review)}
                          alt={getProductName(review)}
                          className="h-11 w-11 shrink-0 rounded-lg border border-gray-200 object-cover"
                        />
                        <span className="line-clamp-1 max-w-40 font-semibold text-gray-900">
                          {getProductName(review)}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {customerName(review)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={review.rating} size={13} />
                        {review.isVerifiedPurchase && (
                          <BadgeCheck
                            size={14}
                            className="text-emerald-600"
                          />
                        )}
                      </div>
                    </td>

                    <td className="max-w-72 px-5 py-4">
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

                    <td className="px-5 py-4">
                      {review.sellerReply ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Replied
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<MessageSquareReply size={14} />}
                        onClick={() => openDetail(review)}
                      >
                        {review.sellerReply ? "View / Edit" : "Reply"}
                      </Button>
                    </td>
                  </tr>
                ))}
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

      {/* ============ DETAIL + REPLY MODAL ============ */}
      {detailReview && (
        <Modal
          isOpen={!!detailReview}
          onClose={() => setDetailReview(null)}
          title="Review Details"
          size="md"
        >
          <div className="space-y-4">
            {/* Product */}
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <img
                src={getProductImage(detailReview)}
                alt={getProductName(detailReview)}
                className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-cover"
              />

              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                  {getProductName(detailReview)}
                </p>
                <p className="text-xs text-gray-400">
                  {customerName(detailReview)} ·{" "}
                  {formatDate(detailReview.createdAt)}
                </p>
              </div>
            </div>

            {/* Rating + review */}
            <div className="flex items-center gap-2">
              <StarRating rating={detailReview.rating} size={15} />
              <span className="text-sm font-semibold text-gray-700">
                {detailReview.rating}.0
              </span>

              {detailReview.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <BadgeCheck size={12} />
                  Verified Purchase
                </span>
              )}
            </div>

            {detailReview.title && (
              <h4 className="font-semibold text-gray-900">
                {detailReview.title}
              </h4>
            )}

            <p className="text-sm leading-6 text-gray-600">
              {detailReview.description || detailReview.comment}
            </p>

            {/* Images */}
            {Array.isArray(detailReview.images) &&
              detailReview.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {detailReview.images.map((image, index) => (
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

            {/* Reply */}
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-xs font-semibold text-gray-700">
                Your Reply
              </label>

              <textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Thank the customer and respond to their feedback..."
                className="mt-1.5 w-full resize-none rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <div className="mt-2 flex justify-end">
                <span className="text-[11px] text-gray-400">
                  {replyText.length}/500
                </span>
              </div>

              <div className="mt-3 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setDetailReview(null)}>
                  Close
                </Button>

                <Button
                  loading={submitting}
                  disabled={!replyText.trim()}
                  leftIcon={<Send size={15} />}
                  onClick={handleSubmitReply}
                >
                  {detailReview.sellerReply
                    ? "Update Reply"
                    : "Post Reply"}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
