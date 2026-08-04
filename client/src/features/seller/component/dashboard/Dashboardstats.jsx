import {
  ShoppingBag,
  ClipboardList,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";

import StatCard from "../../../../shared/components/Statcard";
import { formatMoney } from "../../../order/utils/orderDisplay";

const DashboardStats = ({ stats }) => {
  const dashboardStats = [
    {
      label: "Revenue",
      value: formatMoney(stats?.revenue),
      icon: ShoppingBag,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Total Orders",
      value: stats?.orders || 0,
      icon: ClipboardList,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Products",
      value: stats?.products || 0,
      icon: Package,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "Customers",
      value: stats?.customers || 0,
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: ShoppingCart,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      linkText: "View Orders",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {dashboardStats.map((item) => (
        <StatCard
          key={item.label}
          {...item}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
