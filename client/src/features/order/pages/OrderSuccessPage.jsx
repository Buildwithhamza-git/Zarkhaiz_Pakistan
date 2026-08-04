import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Loader2, PackageCheck } from "lucide-react";

import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";

import { getOrderDetail } from "../api/orderApi";
import OrderItemsList from "../components/OrderItemsList";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import {
  formatMoney,
  formatDateTime,
} from "../utils/orderDisplay";

export default function OrderSuccessPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            View My Orders
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
          {/* ==================================
              CONFIRMATION
          ================================== */}

          <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={36} className="text-green-700" />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              Order Placed Successfully!
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
              Thank you for your order. We have received your order and
              you will be notified when it moves forward.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3">
              <PackageCheck size={18} className="text-green-700" />
              <span className="text-sm font-semibold text-gray-800">
                Order Number: {order.orderNumber}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <OrderStatusBadge status={order.orderStatus} />
              <span className="text-xs text-gray-400">
                Placed on {formatDateTime(order.createdAt)}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/orders"
                className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                View My Orders
              </Link>

              <Link
                to="/products"
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ==================================
              ORDER DETAILS
          ================================== */}

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-gray-900">Items</h2>
              <div className="mt-2">
                <OrderItemsList items={order.items} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-gray-900">Total</h2>

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
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-green-700">
                      {formatMoney(order.totals?.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-gray-900">
                  Delivery Address
                </h2>

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
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
