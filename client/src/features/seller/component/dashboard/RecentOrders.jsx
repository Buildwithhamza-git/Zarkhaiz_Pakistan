import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, PackageOpen } from "lucide-react";

import { getSellerOrders } from "../../../order/api/orderApi";
import { OrderStatusBadge } from "../../../order/components/OrderStatusBadge";
import { formatMoney, formatDateTime } from "../../../order/utils/orderDisplay";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await getSellerOrders({ page: 1, limit: 5 });

        if (mounted) {
          setOrders(response?.data?.items || []);
        }
      } catch (error) {
        console.error("Failed to load recent orders:", error);
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
  }, []);

  const customerName = (order) => {
    const user = order?.user;

    if (user?.firstname || user?.lastname) {
      return `${user.firstname || ""} ${user.lastname || ""}`.trim();
    }

    return user?.email || "Customer";
  };

  const itemNames = (order) =>
    (order?.items || [])
      .map((item) => item.name)
      .filter(Boolean)
      .join(", ");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Recent Orders</h3>

        <Link
          to="/seller/orders"
          className="flex items-center text-xs font-medium text-green-700 hover:underline"
        >
          View All
          <ChevronRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-green-700" />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <PackageOpen size={22} className="text-gray-400" />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            No orders yet. When a customer orders your products,
            they will show up here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order._id}
              className="flex items-center gap-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-xs font-bold text-green-700">
                {order.orderNumber?.slice(-4) || "#"}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-700">
                  {order.orderNumber}
                </p>

                <p className="truncate text-xs text-gray-400">
                  {customerName(order)} · {itemNames(order)}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-gray-700">
                  {formatMoney(order.totals?.total)}
                </p>

                <p className="text-[11px] text-gray-400">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>

              <OrderStatusBadge status={order.orderStatus} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentOrders;
