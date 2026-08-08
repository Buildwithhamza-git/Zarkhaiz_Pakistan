import { MessageSquare } from "lucide-react";

import ReviewCard from "./ReviewCard";
import Loader from "../../../shared/components/ui/Loader";

export default function ReviewList({
  reviews = [],
  loading = false,
  error = "",
  currentUserId,
  onHelpful,
  onReport,
  onEdit,
  onDelete,
  deletingId,
}) {
  if (loading) {
    return <Loader text="Loading reviews..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
        <MessageSquare size={36} className="text-gray-300" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No reviews to show
        </h3>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Try changing the filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          currentUserId={currentUserId}
          onHelpful={onHelpful}
          onReport={onReport}
          onEdit={
            review?.user?._id?.toString() === currentUserId?.toString()
              ? onEdit
              : undefined
          }
          onDelete={
            review?.user?._id?.toString() === currentUserId?.toString()
              ? onDelete
              : undefined
          }
          deleting={deletingId === review._id}
        />
      ))}
    </div>
  );
}
