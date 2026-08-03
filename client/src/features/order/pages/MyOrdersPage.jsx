import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Loader2,
  PackageOpen,
  ShoppingBag,
  XCircle,
} from "lucide-react";

import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";
import Modal from "../../../shared/components/ui/Modal";

import { cancelOrder, getMyOrders } from "../api/orderApi";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import {
  formatMoney,
  formatDateTime,
} from "../utils/orderDisplay";

const PAGE_SIZE = 10;

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmOrder, setConfirmOrder] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getMyOrders({
          page,
          limit: PAGE_SIZE,
        });

        if (!mounted) return;

        setOrders(response?.data?.items || []);
        setTotalPages(response?.data?.totalPages || 1);
      } catch (err) {
        if (mounted) {
          setError(err?.message || "Failed to load orders.");
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
  }, [page]);

  const itemCount = (order) =>
    (order?.items || []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

  const handleCancel = async () => {
    if (!confirmOrder) return;

    setCancellingId(confirmOrder._id);

    try {
      const response = await cancelOrder(confirmOrder._id);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === confirmOrder._id
            ? response?.data || { ...o, orderStatus: "cancelled" }
            : o
        )
      );

      setConfirmOrder(null);

      toast.success("Order cancelled.");
    } catch (err) {
      toast.error(err?.message || "Failed to cancel the order.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <Container className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <ShoppingBag size={22} />
            </span>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Orders
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage your orders.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-green-700" />
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <PackageOpen size={32} className="text-gray-400" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                No orders yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                When you place an order, it will show up here.
              </p>

              <Link
                to="/products"
                className="mt-6 inline-block rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order._id}
                    to={`/orders/${order._id}`}
                    className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatDateTime(order.createdAt)}
                        </p>
                      </div>

                      <OrderStatusBadge status={order.orderStatus} />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-500">
                        {itemCount(order)} items
                      </p>

                      <div className="flex items-center gap-4">
                        {order.orderStatus === "pending" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setConfirmOrder(order);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            {cancellingId === order._id ? (
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <XCircle size={14} />
                            )}
                            Cancel
                          </button>
                        )}

                        <p className="text-lg font-bold text-green-700">
                          {formatMoney(order.totals?.total)}
                        </p>
                      </div>
                    </div>
                  </Link>
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
        </Container>
      </main>

      {/* ==================================
          CANCEL CONFIRMATION MODAL
      ================================== */}

      <Modal
        isOpen={!!confirmOrder}
        onClose={() => setConfirmOrder(null)}
        title="Cancel Order"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Cancel this order?
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            This will cancel {confirmOrder?.orderNumber} and restore the
            stock. This action cannot be undone.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={!!cancellingId}
              onClick={() => setConfirmOrder(null)}
              className="flex-1 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Keep Order
            </button>

            <button
              type="button"
              disabled={!!cancellingId}
              onClick={handleCancel}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {cancellingId ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
              Cancel Order
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
