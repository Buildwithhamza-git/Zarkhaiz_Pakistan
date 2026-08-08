import { useState } from "react";
import {
  BadgeCheck,
  Flag,
  Pencil,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import StarRating from "./StarRating";
import Button from "../../../shared/components/ui/button";

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ReviewCard({
  review,
  currentUserId,
  onHelpful,
  onReport,
  onEdit,
  onDelete,
  deleting = false,
}) {
  const reviewer = review?.user || {};

  const name =
    [reviewer.firstname, reviewer.lastname].filter(Boolean).join(" ") ||
    reviewer.email ||
    "Anonymous";

  const currentUserIdStr = currentUserId?.toString();

  const isOwnReview =
    reviewer?._id?.toString() === currentUserIdStr;

  const [helpfulBusy, setHelpfulBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

  const isHelpful = (review?.helpfulUsers || []).some(
    (id) => id?.toString() === currentUserIdStr
  );

  const handleHelpful = async () => {
    if (!onHelpful || helpfulBusy) return;

    setHelpfulBusy(true);

    const result = await onHelpful(review._id, isHelpful);

    setHelpfulBusy(false);

    if (!result?.success) {
      toast.error(result?.message || "Failed to update review.");
    }
  };

  const handleReport = async () => {
    if (!onReport || reporting) return;

    setReporting(true);

    const result = await onReport(review._id, reportReason.trim());

    setReporting(false);
    setReportOpen(false);
    setReportReason("");

    if (result?.success) {
      toast.success("Review reported. Thank you for your feedback.");
    } else {
      toast.error(result?.message || "Failed to report review.");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      {/* ============ HEADER ============ */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-700 text-sm font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900">{name}</p>

              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <BadgeCheck size={12} />
                  Verified Purchase
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs text-gray-400">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        {onEdit && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(review)}
              leftIcon={<Pencil size={15} />}
            >
              Edit
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={deleting}
              onClick={() => onDelete(review)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              leftIcon={<Trash2 size={15} />}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* ============ RATING ============ */}
      <div className="mt-3 flex items-center gap-2">
        <StarRating rating={review.rating} />
        <span className="text-sm font-semibold text-gray-700">
          {Number(review.rating).toFixed(1)}
        </span>
      </div>

      {/* ============ CONTENT ============ */}
      {review.title && (
        <h4 className="mt-2 font-semibold text-gray-900">
          {review.title}
        </h4>
      )}

      <p className="mt-1 leading-6 text-gray-600">
        {review.description || review.comment}
      </p>

      {/* ============ REVIEW IMAGES ============ */}
      {Array.isArray(review.images) && review.images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {review.images.map((image, index) => (
            <a
              key={index}
              href={image}
              target="_blank"
              rel="noreferrer"
              className="block h-20 w-20 overflow-hidden rounded-xl border border-gray-200"
            >
              <img
                src={image}
                alt="Review attachment"
                className="h-full w-full object-cover transition hover:scale-105"
              />
            </a>
          ))}
        </div>
      )}

      {/* ============ ACTIONS ============ */}
      {!isOwnReview && (
        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={handleHelpful}
            disabled={helpfulBusy}
            className={`
              inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5
              text-xs font-semibold transition disabled:cursor-not-allowed
              disabled:opacity-60
              ${
                isHelpful
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-700"
              }
            `}
          >
            <ThumbsUp size={13} className={isHelpful ? "fill-current" : ""} />
            Helpful ({review.helpfulCount || 0})
          </button>

          <button
            type="button"
            onClick={() => setReportOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 transition hover:border-red-300 hover:text-red-600"
          >
            <Flag size={13} />
            Report
          </button>
        </div>
      )}

      {/* ============ REPORT FORM ============ */}
      {reportOpen && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50/60 p-3">
          <p className="text-xs font-semibold text-gray-700">
            Why are you reporting this review?
          </p>

          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            rows={2}
            maxLength={200}
            placeholder="Optional reason (e.g. offensive content, spam)..."
            className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReportOpen(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>

            <Button
              variant="danger"
              size="sm"
              loading={reporting}
              onClick={handleReport}
            >
              Submit Report
            </Button>
          </div>
        </div>
      )}

      {/* ============ SELLER REPLY ============ */}
      {review.sellerReply && (
        <div className="mt-4 rounded-xl border border-green-100 bg-green-50/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Seller's Response
            </p>

            {review.sellerRepliedAt && (
              <span className="text-[11px] text-gray-400">
                {formatDate(review.sellerRepliedAt)}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm leading-6 text-gray-700">
            {review.sellerReply}
          </p>
        </div>
      )}
    </div>
  );
}
