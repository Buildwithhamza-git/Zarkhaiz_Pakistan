import {
  BarChart3,
  DollarSign,
  MapPin,
  PieChart,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import StatCard from "../../../../shared/components/Statcard";
import Card from "../../../../shared/components/ui/Card";
import { formatMoney } from "../../../order/utils/orderDisplay";

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
      <Icon size={26} className="text-gray-400" />
    </div>

    <h4 className="mt-4 font-semibold text-gray-700">{title}</h4>

    <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
      {description}
    </p>
  </div>
);

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatMoney(0)}
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          trend={0}
        />

        <StatCard
          label="Total Orders"
          value="0"
          icon={ShoppingBag}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          trend={0}
        />

        <StatCard
          label="Avg. Order Value"
          value={formatMoney(0)}
          icon={ShoppingCart}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          trend={0}
        />

        <StatCard
          label="Conversion Rate"
          value="0%"
          icon={Target}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          trend={0}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-gray-800">Revenue Trend</h3>

          <p className="mt-1 text-xs text-gray-400">
            Net revenue over time
          </p>

          <EmptyState
            icon={BarChart3}
            title="No revenue data yet"
            description="Your revenue trend will appear here once you start selling."
          />
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-800">Sales by Category</h3>

          <p className="mt-1 text-xs text-gray-400">
            Order share across product categories
          </p>

          <EmptyState
            icon={PieChart}
            title="No category data yet"
            description="Category insights will appear once you have orders."
          />
        </Card>
      </div>

      {/* Orders chart */}
      <Card>
        <h3 className="font-semibold text-gray-800">Orders Per Month</h3>

        <p className="mt-1 text-xs text-gray-400">
          Completed orders received each month
        </p>

        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Your monthly order breakdown will appear here."
        />
      </Card>

      {/* Top products + Cities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-gray-800">
            Top Selling Products
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Best performing products by orders
          </p>

          <EmptyState
            icon={Sparkles}
            title="No product data yet"
            description="Your top selling products will appear here once you have sales."
          />
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-green-700" />
            <h3 className="font-semibold text-gray-800">Top Cities</h3>
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Where your customers are ordering from
          </p>

          <EmptyState
            icon={MapPin}
            title="No location data yet"
            description="Order locations will appear here once you start selling."
          />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
