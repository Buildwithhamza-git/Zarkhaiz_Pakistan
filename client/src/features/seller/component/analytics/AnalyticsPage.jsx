import { useEffect, useState } from "react";
import { Loader2, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";

import { useSellerContext } from "../../../../context/sellerContext";

import { getAnalytics } from "../../api/financeApi";
import { formatMoney } from "../../../order/utils/orderDisplay";
import StatCard from "../../../../shared/components/Statcard";
import AreaLineChart from "../../../../shared/components/AreaLineChart";
import DonutChart from "../../../../shared/components/DonutChart";

const resolveImage = (image) => {
  if (!image) return null;

  if (/^(https?:|data:)/i.test(image)) return image;

  return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${String(
    image
  ).replace(/\\/g, "/").replace(/^\/+/, "")}`;
};

export default function AnalyticsPage() {
  const { isApproved } = useSellerContext();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isApproved) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getAnalytics();

        if (mounted) setData(res?.data || null);
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load analytics.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isApproved]);

  if (!isApproved) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">
          You are not authorized to access this page.
        </p>
      </div>
    );
  }

  const summary = data?.summary || {};
  const monthly = data?.monthly || [];
  const weekly = data?.weekly || [];
  const statusBreakdown = data?.statusBreakdown || [];
  const topProducts = data?.topProducts || [];

  const donutData = statusBreakdown.map((item) => ({
    name: item.label,
    value: item.orders,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Insights into your store performance based on real orders.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-green-700" />
        </div>
      ) : !data ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
          <p className="text-sm text-gray-500">No analytics available.</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label="Revenue"
              value={formatMoney(summary.revenue)}
              icon={TrendingUp}
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              label="Total Orders"
              value={summary.orders ?? 0}
              icon={ShoppingBag}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              label="Delivered Orders"
              value={summary.earnedOrders ?? 0}
              icon={Package}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
            <StatCard
              label="Units Sold"
              value={summary.units ?? 0}
              icon={Package}
              iconBg="bg-yellow-100"
              iconColor="text-yellow-600"
            />
            <StatCard
              label="Avg Order Value"
              value={formatMoney(summary.avgOrderValue)}
              icon={Users}
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
            />
          </div>

          {/* Monthly revenue */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                Monthly Revenue
              </h3>
              <span className="text-xs text-gray-400">Last 12 months</span>
            </div>

            <AreaLineChart data={monthly} height={220} />
          </div>

          {/* Weekly + status donut */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  Weekly Revenue
                </h3>
                <span className="text-xs text-gray-400">Last 8 weeks</span>
              </div>

              <AreaLineChart data={weekly} height={220} />
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  Orders by Status
                </h3>
                <span className="text-xs text-gray-400">All time</span>
              </div>

              <DonutChart data={donutData} height={220} />
            </div>
          </div>

          {/* Top products */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-gray-800">Top Products</h3>
            </div>

            {topProducts.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-gray-500">
                  No delivered products yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-3.5 font-semibold">Product</th>
                      <th className="px-5 py-3.5 font-semibold">Units</th>
                      <th className="px-5 py-3.5 font-semibold">Orders</th>
                      <th className="px-5 py-3.5 font-semibold">Revenue</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {topProducts.map((product) => {
                      const imageUrl = resolveImage(product.image);

                      return (
                        <tr
                          key={product._id}
                          className="transition hover:bg-gray-50/60"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={product.name}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                                  <Package size={18} />
                                </div>
                              )}
                              <span className="font-semibold text-gray-900">
                                {product.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {product.units}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {product.orders}
                          </td>

                          <td className="px-5 py-4 font-semibold text-gray-900">
                            {formatMoney(product.revenue)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
