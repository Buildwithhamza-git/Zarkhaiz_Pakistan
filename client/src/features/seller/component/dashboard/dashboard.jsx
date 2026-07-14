import React from "react";
import {
  Leaf,
  Calendar,
  FileDown,
  ShoppingBag,
  ClipboardList,
  Package,
  Users,
  ShoppingCart,
  Store,
  Star,
  PlusCircle,
  Wallet,
  ChevronRight,
} from "lucide-react";

import StatCard from "../../../../shared/components/Statcard";
import Badge from "../../../../shared/components/Badge";
import Button from "../../../../shared/components/ui/button";
import DonutChart from "../../../../shared/components/DonutChart";
import AreaLineChart from "../../../../shared/components/AreaLineChart";

// --- Mock data (replace with API data) ---
const stats = [
  {
    label: "Total Sales",
    value: "Rs. 285,750",
    icon: ShoppingBag,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    trend: 18.6,
  },
  {
    label: "Total Orders",
    value: "156",
    icon: ClipboardList,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    trend: 14.2,
  },
  {
    label: "Total Products",
    value: "42",
    icon: Package,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    trend: 8.3,
  },
  {
    label: "Total Customers",
    value: "1,250",
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    trend: 20.5,
  },
  {
    label: "Pending Orders",
    value: "8",
    icon: ShoppingCart,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    linkText: "View all orders",
  },
];

const salesOverview = [
  { label: "May 17", value: 12 },
  { label: "May 24", value: 22 },
  { label: "May 31", value: 15 },
  { label: "Jun 7", value: 24 },
  { label: "Jun 14", value: 40 },
];

const recentOrders = [
  { id: "#ORD-5214", customer: "Ali Hassan", amount: "Rs. 3,250", date: "17 Jun, 2025", status: "Pending", color: "bg-red-200" },
  { id: "#ORD-5213", customer: "Usman Khan", amount: "Rs. 2,150", date: "17 Jun, 2025", status: "Processing", color: "bg-amber-200" },
  { id: "#ORD-5212", customer: "Farah Iqbal", amount: "Rs. 4,800", date: "16 Jun, 2025", status: "Shipped", color: "bg-gray-200" },
  { id: "#ORD-5211", customer: "Hamza Ahmed", amount: "Rs. 1,650", date: "16 Jun, 2025", status: "Delivered", color: "bg-red-100" },
  { id: "#ORD-5210", customer: "Zainab Akhtar", amount: "Rs. 2,950", date: "15 Jun, 2025", status: "Delivered", color: "bg-red-200" },
];

const statusColor = {
  Pending: "yellow",
  Processing: "blue",
  Shipped: "purple",
  Delivered: "green",
};

const storeChecklist = [
  "Complete Profile",
  "Add Products",
  "Verify Documents",
  "Bank Details",
  "Store Banner",
];

const orderStatusData = [
  { label: "Pending", value: 8, color: "#facc15" },
  { label: "Processing", value: 12, color: "#3b82f6" },
  { label: "Shipped", value: 25, color: "#a855f7" },
  { label: "Delivered", value: 38, color: "#22c55e" },
];

const reviewBreakdown = [
  { stars: 5, percent: 70 },
  { stars: 4, percent: 20 },
  { stars: 3, percent: 7 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
];

const topProducts = [
  { name: "Basmati Rice 5kg", price: "Rs. 1,850", sales: "120 Sales", color: "bg-yellow-100" },
  { name: "Organic Potato 1kg", price: "Rs. 120", sales: "98 Sales", color: "bg-amber-100" },
  { name: "Tomato Hybrid 1kg", price: "Rs. 160", sales: "85 Sales", color: "bg-red-100" },
  { name: "DAP Fertilizer 50kg", price: "Rs. 4,200", sales: "70 Sales", color: "bg-green-100" },
  { name: "Apple Red 1kg", price: "Rs. 250", sales: "65 Sales", color: "bg-rose-100" },
];

const quickActions = [
  { label: "Add New Product", icon: PlusCircle, color: "text-green-700 bg-green-50" },
  { label: "Manage Products", icon: Package, color: "text-orange-600 bg-orange-50" },
  { label: "View Orders", icon: ShoppingCart, color: "text-red-500 bg-red-50", badge: 8 },
  { label: "Manage Reviews", icon: Star, color: "text-yellow-600 bg-yellow-50" },
  { label: "Store Settings", icon: Store, color: "text-gray-600 bg-gray-100" },
  { label: "Analytics Report", icon: FileDown, color: "text-blue-600 bg-blue-50" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <Leaf size={20} className="mt-1 text-green-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-400">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Calendar size={16} />}
            className="!border-gray-200 !text-gray-600 hover:!bg-gray-50 focus:!ring-gray-300"
          >
            May 17, 2025 - Jun 17, 2025
          </Button>

          <Button variant="primary" size="sm" leftIcon={<FileDown size={16} />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Sales overview / Recent orders / Store status */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Sales Overview */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 xl:col-span-1 xl:row-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Sales Overview</h3>
            <select className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-500 outline-none">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <AreaLineChart data={salesOverview} height={200} />
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Recent Orders</h3>
            <button className="flex items-center text-xs font-medium text-green-700 hover:underline">
              View All <ChevronRight size={14} />
            </button>
          </div>

          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center gap-3">
                <span className={`h-9 w-9 shrink-0 rounded-lg ${order.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-700">
                    {order.id}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    {order.customer}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {order.amount}
                  </p>
                  <p className="text-[11px] text-gray-400">{order.date}</p>
                </div>
                <Badge color={statusColor[order.status]}>{order.status}</Badge>
              </li>
            ))}
          </ul>
        </div>

        {/* Store Status */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Store Status</h3>
            <Badge color="green">Active</Badge>
          </div>

          <div className="flex items-center gap-4">
            <DonutChart
              data={[
                { value: 80, color: "#15803d" },
                { value: 20, color: "#e5e7eb" },
              ]}
              size={100}
              strokeWidth={11}
              centerTitle="80%"
            />
            <p className="text-xs text-gray-400 leading-snug">
              Store Profile
              <br />
              Completed
            </p>
          </div>

          <ul className="mt-4 space-y-2">
            {storeChecklist.map((item) => (
              <li
                key={item}
                className="flex items-center justify-between text-sm text-gray-600"
              >
                {item}
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] text-white">
                  ✓
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Earnings / Orders status / Reviews */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Earnings Overview */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Earnings Overview</h3>
            <select className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-500 outline-none">
              <option>This Month</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400">Total Earnings</p>
              <p className="text-lg font-bold text-gray-800">Rs. 285,750</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Available Balance</p>
              <p className="text-lg font-bold text-green-700">Rs. 45,780</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-400">Pending Balance</p>
            <p className="text-base font-semibold text-orange-500">
              Rs. 12,500
            </p>
          </div>

          <Button
            variant="primary"
            fullWidth
            leftIcon={<Wallet size={16} />}
            className="mt-4"
          >
            Request Payout
          </Button>
        </div>

        {/* Orders Status */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-4 font-semibold text-gray-800">Orders Status</h3>

          <div className="flex items-center gap-6">
            <DonutChart data={orderStatusData} size={130} strokeWidth={18} />

            <ul className="space-y-2 text-sm">
              {orderStatusData.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-700">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reviews */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Reviews</h3>
            <button className="text-xs font-medium text-green-700 hover:underline">
              View All
            </button>
          </div>

          <div className="mb-3 flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-800">4.6</span>
            <div>
              <div className="flex text-yellow-400">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <p className="text-xs text-gray-400">(245 Reviews)</p>
            </div>
          </div>

          <div className="space-y-1.5">
            {reviewBreakdown.map((r) => (
              <div key={r.stars} className="flex items-center gap-2 text-xs">
                <span className="w-10 text-gray-500">{r.stars} Stars</span>
                <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-green-600"
                    style={{ width: `${r.percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-400">
                  {r.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Top Selling Products</h3>
          <button className="text-xs font-medium text-green-700 hover:underline">
            View All
          </button>
        </div>

        <ul className="divide-y divide-gray-100">
          {topProducts.map((product) => (
            <li
              key={product.name}
              className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <span className={`h-9 w-9 shrink-0 rounded-lg ${product.color}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-700">
                  {product.name}
                </p>
                <p className="text-xs text-gray-400">{product.price}</p>
              </div>
              <span className="text-xs font-medium text-gray-500">
                {product.sales}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h3 className="mb-4 font-semibold text-gray-800">Quick Actions</h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map(({ label, icon: Icon, color, badge }) => (
            <button
              key={label}
              className="relative flex flex-col items-center gap-2 rounded-xl border border-gray-100 py-4 text-center hover:bg-gray-50 transition-colors"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${color}`}
              >
                <Icon size={17} />
              </span>
              <span className="text-xs font-medium text-gray-600">
                {label}
              </span>
              {badge && (
                <span className="absolute right-3 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;