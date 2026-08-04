import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ChevronDown,
  ClipboardList,
  IndianRupee,
  Loader2,
  Package,
} from "lucide-react";

import { useSellerContext } from "../../../../context/sellerContext";

import {
  getSellerOrders,
  getSellerOrderStats,
  updateSellerOrderStatus,
} from "../../../order/api/orderApi";
import { OrderStatusBadge } from "../../../order/components/OrderStatusBadge";
import { formatMoney, formatDateTime } from "../../../order/utils/orderDisplay";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const ALLOWED_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const STATUS_LABELS = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAGE_SIZE = 10;

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

export default function SellerOrdersPage() {
  const { seller, isApproved } = useSellerContext();

  const sellerId = seller?._id?.toString();

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    if (!isApproved) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [ordersRes, statsRes] = await Promise.all([
          getSellerOrders({
            page,
            limit: PAGE_SIZE,
            ...(status ? { orderStatus: status } : {}),
          }),
          getSellerOrderStats(),
        ]);

        if (!mounted) return;

        setOrders(ordersRes?.data?.items || []);
        setTotalPages(ordersRes?.data?.totalPages || 1);
        setStats(statsRes?.data || null);
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
  }, [isApproved, status, page]);

  const refreshStats = async () => {
    try {
      const statsRes = await getSellerOrderStats();

      setStats(statsRes?.data || null);
    } catch (err) {
      console.error("Failed to refresh order stats:", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);

    try {
      const response = await updateSellerOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, ...(response?.data || {}), orderStatus: newStatus }
            : order
        )
      );

      refreshStats();

      toast.success(`Order marked as ${STATUS_LABELS[newStatus]}.`);
    } catch (err) {
      toast.error(err?.message || "Failed to update order status.");
    } finally {
      setUpdatingId("");
    }
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

  const customerName = (order) => {
    const user = order?.user;

    if (user?.firstname || user?.lastname) {
      return `${user.firstname || ""} ${user.lastname || ""}`.trim();
    }

    return user?.email || "Customer";
  };

  const itemCount = (order) =>
    (order?.items || []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage the orders placed on your products.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          icon={ClipboardList}
          label="Total Orders"
          value={stats?.totalOrders ?? "—"}
          accent="bg-blue-100 text-blue-700"
        />
        <StatsCard
          icon={Package}
          label="Pending Orders"
          value={stats?.pendingOrders ?? "—"}
          accent="bg-yellow-100 text-yellow-700"
        />
        <StatsCard
          icon={IndianRupee}
          label="Revenue"
          value={stats ? formatMoney(stats.revenue) : "—"}
          accent="bg-green-100 text-green-700"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Status filter */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => {
              setStatus(filter.value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              status === filter.value
                ? "bg-green-700 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-green-700" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3.5 font-semibold">Order #</th>
                  <th className="px-5 py-3.5 font-semibold">Customer</th>
                  <th className="px-5 py-3.5 font-semibold">Items</th>
                  <th className="px-5 py-3.5 font-semibold">Total</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const allItemsMine =
                    !!sellerId &&
                    (order?.items || []).length > 0 &&
                    (order?.items || []).every(
                      (item) => item.seller?.toString() === sellerId
                    );

                  const transitions = allItemsMine
                    ? ALLOWED_TRANSITIONS[order.orderStatus] || []
                    : [];
                  const isUpdating = updatingId === order._id;

                  return (
                  <tr
                    key={order._id}
                    className="transition hover:bg-gray-50/60"
                  >
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {order.orderNumber}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {customerName(order)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {itemCount(order)} items
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatMoney(order.totals?.total)}
                    </td>

                    <td className="px-5 py-4">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {formatDateTime(order.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      {transitions.length > 0 ? (
                        <div className="relative inline-block">
                          <select
                            value=""
                            onChange={(event) =>
                              handleStatusChange(order._id, event.target.value)
                            }
                            disabled={isUpdating}
                            className="cursor-pointer appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-xs font-semibold text-gray-700 transition hover:border-green-300 focus:border-green-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="" disabled>
                              {isUpdating ? "Updating..." : "Update"}
                            </option>
                            {transitions.map((nextStatus) => (
                              <option key={nextStatus} value={nextStatus}>
                                {STATUS_LABELS[nextStatus]}
                              </option>
                            ))}
                          </select>

                          <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No update
                        </span>
                      )}
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
    </div>
  );
}
