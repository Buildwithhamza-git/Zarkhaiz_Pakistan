import {
  Banknote,
  BarChart3,
  Clock,
  PieChart,
  Receipt,
  Wallet,
} from "lucide-react";

import StatCard from "../../../../shared/components/Statcard";
import Card from "../../../../shared/components/ui/Card";
import Button from "../../../../shared/components/ui/button";
import { formatMoney } from "../../../order/utils/orderDisplay";

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
      <Icon size={26} className="text-gray-400" />
    </div>

    <h4 className="mt-4 font-semibold text-gray-700">{title}</h4>

    <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
      {description}
    </p>

    {action && <div className="mt-5">{action}</div>}
  </div>
);

const EarningsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Earnings"
          value={formatMoney(0)}
          icon={Wallet}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          trend={0}
        />

        <StatCard
          label="Available Balance"
          value={formatMoney(0)}
          icon={Banknote}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          trend={0}
        />

        <StatCard
          label="Pending Clearance"
          value={formatMoney(0)}
          icon={Clock}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          trend={0}
        />

        <StatCard
          label="Total Withdrawn"
          value={formatMoney(0)}
          icon={PieChart}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          trend={0}
        />
      </div>

      {/* Chart + Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-gray-800">Earnings Overview</h3>

          <p className="mt-1 text-xs text-gray-400">
            Net earnings after commission over time
          </p>

          <EmptyState
            icon={BarChart3}
            title="No earnings data yet"
            description="Once you start receiving orders, your earnings will show up here."
          />
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-800">
            Earnings by Category
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Share of earnings from each product category
          </p>

          <EmptyState
            icon={PieChart}
            title="No category data yet"
            description="Category breakdown will appear once you have earnings."
          />
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">
            Earnings Transactions
          </h3>

          <p className="mt-0.5 text-xs text-gray-400">
            A summary of recent settlements and withdrawals
          </p>
        </div>

        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Settlements and withdrawals will appear here once you have earnings."
          action={
            <Button variant="outline" size="sm">
              Refresh
            </Button>
          }
        />
      </Card>
    </div>
  );
};

export default EarningsPage;
