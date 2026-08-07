import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  Pencil,
  Star,
} from "lucide-react";

import Modal from "../../../shared/components/ui/Modal";
import Button from "../../../shared/components/ui/button";
import ReviewForm from "./ReviewForm";
import { createReview, updateReview } from "../api/reviewApi";

const getItemImage = (item) =>
  item?.image || "https://placehold.co/400x400?text=No+Image";

const isReviewed = (item, reviewMap) =>
  Boolean(
    item?.product &&
      reviewMap?.[item.product.toString()]?.alreadyReviewed
  );

export default function OrderReviewModal({
  open = false,
  onClose,
  order,
  reviewMap = {},
  onReviewed,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const items = Array.isArray(order?.items) ? order.items : [];

  const reviewedCount = items.filter((item) =>
    isReviewed(item, reviewMap)
  ).length;

  const handleSubmit = async (payload, images) => {
    if (!selectedItem) return { success: false };

    setSubmitting(true);

    try {
      await createReview(
        {
          productId: selectedItem.product.toString(),
          orderId: order._id,
          ...payload,
        },
        images
      );

      toast.success("Review submitted. Thank you!");
      onReviewed?.(selectedItem.product.toString());
      setSelectedItem(null);
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

  const handleEditSubmit = async (payload, images) => {
    if (!editing?.review?._id) return { success: false };

    setSubmitting(true);

    try {
      await updateReview(editing.review._id, payload, images);

      toast.success("Review updated.");
      onReviewed?.(editing.item.product.toString());
      setEditing(null);
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

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setSelectedItem(null);
        setEditing(null);
        onClose();
      }}
      title={
        editing
          ? "Edit Review"
          : selectedItem
          ? "Write a Review"
          : "Review Your Order"
      }
      size="md"
    >
      {editing ? (
        <ReviewForm
          inline
          open
          mode="edit"
          productName={editing.item.name || "Product"}
          productImage={getItemImage(editing.item)}
          initialData={editing.review}
          submitting={submitting}
          onSubmit={handleEditSubmit}
        />
      ) : !selectedItem ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
            {reviewedCount} of {items.length} items reviewed. Thanks for
            sharing your experience!
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-gray-500">
              No items found for this order.
            </p>
          ) : (
            items.map((item) => {
              const reviewed = isReviewed(item, reviewMap);

              return (
                <div
                  key={item._id || item.product?.toString()}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getItemImage(item)}
                      alt={item.name || "Product"}
                      className="h-14 w-14 shrink-0 rounded-xl border border-gray-200 object-cover"
                    />

                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                        {item.name || "Product"}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        Qty: {item.quantity} {item.unit || ""}
                      </p>
                    </div>
                  </div>

                  {reviewed ? (
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={14} />
                        Reviewed
                      </span>

                      <div className="flex items-center gap-2">
                        {reviewMap?.[item.product.toString()]?.existingReview && (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Pencil size={13} />}
                            onClick={() =>
                              setEditing({
                                item,
                                review:
                                  reviewMap[item.product.toString()]
                                    .existingReview,
                              })
                            }
                          >
                            Edit
                          </Button>
                        )}

                        <Link
                          to={`/products/${item.product.toString()}#reviews`}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-green-300 hover:text-green-700"
                        >
                          <ExternalLink size={13} />
                          View
                        </Link>
                      </div>
                    </div>
                  ) : item.product ? (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Star size={14} />}
                      onClick={() => setSelectedItem(item)}
                    >
                      Write Review
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Not available
                    </span>
                  )}
                </div>
              );
            })
          )}

          {reviewedCount === items.length && items.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <BadgeCheck size={15} />
                All items reviewed!
              </span>
            </div>
          )}
        </div>
      ) : (
        <ReviewForm
          inline
          open
          productName={selectedItem.name || "Product"}
          productImage={getItemImage(selectedItem)}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      )}
    </Modal>
  );
}
