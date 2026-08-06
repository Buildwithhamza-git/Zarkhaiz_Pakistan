import {
  Banknote,
  Calendar,
  FileDown,
  TrendingDown,
  TrendingUp,
  Wallet,
  Clock,
  PieChart,
} from "lucide-react";

import StatCard from "../../../../shared/components/Statcard";
import AreaLineChart from "../../../../shared/components/AreaLineChart";
import DonutChart from "../../../../shared/components/DonutChart";
import Badge from "../../../../shared/components/Badge";
import Button from "../../../../shared/components/ui/button";
import { formatMoney } from "../../../order/utils/orderDisplay";

const earningsTrend = [
  { name: "Feb", value: 18500 },
  { name: "Mar", value: 22800 },
  { name: "Apr", value: 19600 },
  { name: "May", value: 31200 },
  { name: "Jun", value: 27800 },
  { name: "Jul", value: 35400 },
  { name: "Aug", value: 41200 },
];

const categoryBreakdown = [
  { name: "Vegetables", value: 38 },
  { name: "Fruits", value: 27 },
  { name: "Grains", value: 18 },
  { name: "Dairy", value: 11 },
  { name: "Others", value: 6 },
];

const transactions = [
  {
    id: "1",
    order: "ZK-2481",
    source: "Order #2481 - Organic Wheat",
    date: "Aug 04, 2026",
    amount: 5400,
    status: "Available",
  },
  {
    id: "2",
    order: "ZK-2478",
    source: "Order #2478 - Fresh Tomatoes",
    date: "Aug 03, 2026",
    amount: 3100,
    status: "Available",
  },
  {
    id: "3",
    order: "ZK-2475",
    source: "Order #2475 - Mango Basket",
    date: "Aug 01, 2026",
    amount: 8200,
    status: "Pending",
  },
  {
    id: "4",
    order: "ZK-2469",
    source: "Order #2469 - Dairy Pack",
    date: "Jul 30, 2026",
    amount: 4600,
    status: "Pending",
  },
  {
    id: "5",
    order: "ZK-2462",
    source: "Order #2462 - Basmati Rice",
    date: "Jul 28, 2026",
    amount: 11700,
    status: "Withdrawn",
  },
  {
    id: "6",
    order: "ZK-2458",
    source: "Order #2458 - Seasonal Mix",
    date: "Jul 26, 2026",
    amount: 2900,
    status: "Refunded",
  },
];

const statusTone = {
  Available: "green",
  Pending: "yellow",
  Withdrawn: "blue",
  Refunded: "red",
};

const EarningsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-green-100 p-2">
            <Wallet size={20} className="text-green-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Earnings</h1>

            <p className="mt-1 text-sm text-gray-500">
              Track your income and payment settlements.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Calendar size={16} />}
          >
            This Month
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<FileDown size={16} />}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Earnings"
          value={formatMoney(216500)}
          icon={Wallet}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          trend={18.5}
        />

        <StatCard
          label="Available Balance"
          value={formatMoney(48700)}
          icon={Banknote}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          trend={12}
        />

        <StatCard
          label="Pending Clearance"
          value={formatMoney(15900)}
          icon={Clock}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          trend={0}
        />

        <StatCard
          label="Total Withdrawn"
          value={formatMoney(151900)}
          icon={PieChart}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          trend={24.3}
        />
      </div>

      {/* Chart + Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">
                Earnings Overview
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Net earnings after commission over the last 7 months
              </p>
            </div>

            <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <TrendingUp size={14} />
              +18.5%
            </span>
          </div>

          <AreaLineChart data={earningsTrend} height={260} />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="font-semibold text-gray-800">
            Earnings by Category
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Share of earnings from each product category
          </p>

          <DonutChart data={categoryBreakdown} height={230} />
        </div>
      </div>

      {/* Transactions */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h3 className="font-semibold text-gray-800">
              Earnings Transactions
            </h3>

            <p className="mt-0.5 text-xs text-gray-400">
              A summary of recent settlements and withdrawals
            </p>
          </div>

          <span className="hidden text-xs text-gray-400 sm:block">
            Showing 6 of 24
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3.5 font-semibold">Order</th>
                <th className="px-5 py-3.5 font-semibold">Source</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Amount</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="transition hover:bg-gray-50/60">
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {tx.order}
                  </td>

                  <td className="px-5 py-4 text-gray-600">{tx.source}</td>

                  <td className="px-5 py-4 text-xs text-gray-500">
                    {tx.date}
                  </td>

                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {formatMoney(tx.amount)}
                  </td>

                  <td className="px-5 py-4">
                    <Badge color={statusTone[tx.status] || "gray"}>
                      {tx.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <p className="flex items-center gap-1.5 text-xs text-gray-400">
            <TrendingDown size={14} className="text-red-400" />
            Refunds are deducted from available balance
          </p>

          <Button variant="ghost" size="sm">
            View All Transactions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
