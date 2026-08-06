import {
  Calendar,
  DollarSign,
  MapPin,
  ShoppingBag,
  ShoppingCart,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import StatCard from "../../../../shared/components/Statcard";
import AreaLineChart from "../../../../shared/components/AreaLineChart";
import DonutChart from "../../../../shared/components/DonutChart";
import Button from "../../../../shared/components/ui/button";
import { formatMoney } from "../../../order/utils/orderDisplay";

const revenueTrend = [
  { name: "Feb", value: 18500 },
  { name: "Mar", value: 22800 },
  { name: "Apr", value: 19600 },
  { name: "May", value: 31200 },
  { name: "Jun", value: 27800 },
  { name: "Jul", value: 35400 },
  { name: "Aug", value: 41200 },
];

const ordersByMonth = [
  { name: "Feb", orders: 42 },
  { name: "Mar", orders: 51 },
  { name: "Apr", orders: 47 },
  { name: "May", orders: 68 },
  { name: "Jun", orders: 62 },
  { name: "Jul", orders: 79 },
  { name: "Aug", orders: 94 },
];

const categoryShare = [
  { name: "Vegetables", value: 38 },
  { name: "Fruits", value: 27 },
  { name: "Grains", value: 18 },
  { name: "Dairy", value: 11 },
  { name: "Others", value: 6 },
];

const topProducts = [
  {
    id: "1",
    name: "Organic Wheat (1kg)",
    category: "Grains",
    orders: 148,
    revenue: 74000,
    stock: "In Stock",
  },
  {
    id: "2",
    name: "Fresh Mangoes (Dozen)",
    category: "Fruits",
    orders: 121,
    revenue: 60500,
    stock: "In Stock",
  },
  {
    id: "3",
    name: "Farm Fresh Tomatoes (1kg)",
    category: "Vegetables",
    orders: 98,
    revenue: 29400,
    stock: "Low Stock",
  },
  {
    id: "4",
    name: "Basmati Rice (5kg)",
    category: "Grains",
    orders: 74,
    revenue: 51800,
    stock: "In Stock",
  },
  {
    id: "5",
    name: "Desi Ghee (1L)",
    category: "Dairy",
    orders: 61,
    revenue: 42700,
    stock: "Out of Stock",
  },
];

const topCities = [
  { city: "Lahore", orders: 184, revenue: 92300 },
  { city: "Karachi", orders: 162, revenue: 81600 },
  { city: "Islamabad", orders: 127, revenue: 63400 },
  { city: "Faisalabad", orders: 96, revenue: 48100 },
  { city: "Multan", orders: 71, revenue: 35500 },
];

const stockTone = {
  "In Stock": "text-green-600",
  "Low Stock": "text-amber-600",
  "Out of Stock": "text-red-600",
};

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-green-100 p-2">
            <TrendingUp size={20} className="text-green-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>

            <p className="mt-1 text-sm text-gray-500">
              Insights into your store performance and customer behavior.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Calendar size={16} />}
          >
            Last 30 Days
          </Button>

          <Button variant="primary" size="sm">
            Apply
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatMoney(216500)}
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          trend={18.5}
        />

        <StatCard
          label="Total Orders"
          value="443"
          icon={ShoppingBag}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          trend={12.4}
        />

        <StatCard
          label="Avg. Order Value"
          value={formatMoney(488)}
          icon={ShoppingCart}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          trend={5.2}
        />

        <StatCard
          label="Conversion Rate"
          value="3.8%"
          icon={Target}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          trend={1.1}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Revenue Trend</h3>

              <p className="mt-1 text-xs text-gray-400">
                Net revenue over the last 7 months
              </p>
            </div>

            <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <TrendingUp size={14} />
              +18.5%
            </span>
          </div>

          <AreaLineChart data={revenueTrend} height={250} />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="font-semibold text-gray-800">Sales by Category</h3>

          <p className="mt-1 text-xs text-gray-400">
            Order share across product categories
          </p>

          <DonutChart data={categoryShare} height={220} />
        </div>
      </div>

      {/* Orders bar chart */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Orders Per Month</h3>

            <p className="mt-1 text-xs text-gray-400">
              Completed orders received each month
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            443 total
          </span>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ordersByMonth} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={34}
            />

            <Tooltip cursor={{ fill: "#f0fdf4" }} />

            <Bar
              dataKey="orders"
              radius={[6, 6, 0, 0]}
              fill="#22c55e"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top products + Cities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top products */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h3 className="font-semibold text-gray-800">
                Top Selling Products
              </h3>

              <p className="mt-0.5 text-xs text-gray-400">
                Best performing products by orders
              </p>
            </div>

            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3.5 font-semibold">Product</th>
                  <th className="px-5 py-3.5 font-semibold">Category</th>
                  <th className="px-5 py-3.5 font-semibold">Orders</th>
                  <th className="px-5 py-3.5 font-semibold">Revenue</th>
                  <th className="px-5 py-3.5 font-semibold">Stock</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {topProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-gray-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-xs font-bold text-green-700">
                          {index + 1}
                        </span>

                        <span className="font-medium text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {product.orders}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatMoney(product.revenue)}
                    </td>

                    <td
                      className={`px-5 py-4 text-xs font-medium ${stockTone[product.stock]}`}
                    >
                      {product.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top cities */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-green-700" />
            <h3 className="font-semibold text-gray-800">Top Cities</h3>
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Where your customers are ordering from
          </p>

          <ul className="mt-5 space-y-4">
            {topCities.map((city, index) => {
              const maxOrders = topCities[0].orders;
              const width = Math.round((city.orders / maxOrders) * 100);

              return (
                <li key={city.city}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-[10px] font-bold text-green-700">
                        {index + 1}
                      </span>

                      <span className="font-medium text-gray-700">
                        {city.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {city.orders} orders
                      </span>

                      <span className="w-16 text-right text-xs font-semibold text-gray-700">
                        {formatMoney(city.revenue)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-700"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
            <Users size={16} className="mt-0.5 shrink-0 text-green-600" />
            <p>
              Most of your orders come from Punjab. Consider expanding
              delivery to Balochistan and Khyber Pakhtunkhwa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
