import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Star,
  XCircle,
} from "lucide-react";

import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";
import Modal from "../../../shared/components/ui/Modal";

import { useAuthContext } from "../../../context/authContext";

import { cancelOrder, getOrderDetail } from "../api/orderApi";
import { getReviewEligibility } from "../../review/api/reviewApi";
import OrderReviewModal from "../../review/components/OrderReviewModal";
import OrderItemsList from "../components/OrderItemsList";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "../components/OrderStatusBadge";
import {
  formatMoney,
  formatDateTime,
} from "../utils/orderDisplay";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { user } = useAuthContext();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewMap, setReviewMap] = useState({});

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await getOrderDetail(orderId);

        if (mounted) {
          setOrder(response?.data || null);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || "Unable to load order details.");
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
  }, [orderId]);

  const isOwner =
    !!user &&
    order?.user?._id?.toString() === user?.id?.toString();

  const canCancel = isOwner && order?.orderStatus === "pending";

  // ==========================================
  // Load review eligibility for delivered
  // products so "Reviewed" state persists
  // ==========================================

  useEffect(() => {
    if (order?.orderStatus !== "delivered") return;

    let mounted = true;

    const productIds = (order.items || [])
      .map((item) => item?.product?.toString())
      .filter(Boolean);

    const uniqueIds = [...new Set(productIds)];

    if (uniqueIds.length === 0) return;

    const loadReviewStatus = async () => {
      const results = await Promise.allSettled(
        uniqueIds.map((productId) => getReviewEligibility(productId))
      );

      if (!mounted) return;

      const next = {};

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          next[uniqueIds[index]] = result.value?.data || {
            alreadyReviewed: false,
          };
        }
      });

      setReviewMap((prev) => ({ ...prev, ...next }));
    };

    loadReviewStatus();

    return () => {
      mounted = false;
    };
  }, [order]);

  const handleReviewed = (productId) => {
    setReviewMap((prev) => ({
      ...prev,
      [productId]: { alreadyReviewed: true },
    }));
  };

  const handleCancel = async () => {
    setCancelling(true);

    try {
      const response = await cancelOrder(orderId);

      setOrder(response?.data || { ...order, orderStatus: "cancelled" });
      setConfirmCancel(false);

      toast.success("Order cancelled.");
    } catch (err) {
      toast.error(err?.message || "Failed to cancel the order.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-green-700" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Container className="py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Order not found
          </h1>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <Link
            to="/orders"
            className="mt-6 inline-block rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Back to My Orders
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <Container className="px-4 py-10 sm:px-6 sm:py-14">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
          >
            <ArrowLeft size={16} />
            Back to My Orders
          </Link>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {order.orderNumber}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <OrderStatusBadge status={order.orderStatus} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>

          {order.orderStatus === "delivered" && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Star size={18} />
                </span>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Your order has been delivered!
                  </p>
                  <p className="mt-0.5 text-xs text-gray-600">
                    Share your feedback to help other farmers make better
                    choices.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReviewOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <Star size={16} />
                Write a Review
              </button>
            </div>
          )}

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-gray-900">Items</h2>
              <div className="mt-2">
                <OrderItemsList items={order.items} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-gray-900">Payment Summary</h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatMoney(order.totals?.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery</span>
                    <span className="font-medium text-gray-900">
                      {order.totals?.deliveryFee === 0
                        ? "Free"
                        : formatMoney(order.totals?.deliveryFee)}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-green-700">
                      {formatMoney(order.totals?.total)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Payment Method</span>
                    <span className="font-medium">
                      {order.paymentMethod || "COD"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700">
                    <MapPin size={18} />
                  </span>
                  <h2 className="font-bold text-gray-900">
                    Delivery Address
                  </h2>
                </div>

                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-800">
                    {order.shippingAddress?.fullName}
                  </p>
                  <p>{order.shippingAddress?.phone}</p>
                  <p>
                    {order.shippingAddress?.address},{" "}
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.province}
                  </p>
                  <p>
                    {order.shippingAddress?.country}
                    {order.shippingAddress?.postalCode
                      ? ` - ${order.shippingAddress.postalCode}`
                      : ""}
                  </p>
                </div>
              </div>

              {order.notes && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900">Order Notes</h2>
                  <p className="mt-2 text-sm text-gray-600">{order.notes}</p>
                </div>
              )}

              {canCancel && (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <XCircle size={16} />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </Container>
      </main>

      {/* ==================================
          CANCEL CONFIRMATION MODAL
      ================================== */}

      <Modal
        isOpen={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel Order"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Cancel this order?
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            This will cancel {order.orderNumber} and restore the stock.
            This action cannot be undone.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={cancelling}
              onClick={() => setConfirmCancel(false)}
              className="flex-1 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Keep Order
            </button>

            <button
              type="button"
              disabled={cancelling}
              onClick={handleCancel}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {cancelling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
              Cancel Order
            </button>
          </div>
        </div>
      </Modal>

      {/* ==================================
          REVIEW ORDER MODAL
      ================================== */}

      <OrderReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        order={order}
        reviewMap={reviewMap}
        onReviewed={handleReviewed}
      />
    </div>
  );
}
