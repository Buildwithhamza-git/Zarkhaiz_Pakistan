import React from "react";
import { ChevronRight } from "lucide-react";

import Badge from "../../../../shared/components/Badge";

const recentOrders = [
  {
    id: "#ORD-5214",
    customer: "Ali Hassan",
    amount: "Rs. 3,250",
    date: "17 Jun, 2025",
    status: "Pending",
    color: "bg-red-200",
  },
  {
    id: "#ORD-5213",
    customer: "Usman Khan",
    amount: "Rs. 2,150",
    date: "17 Jun, 2025",
    status: "Processing",
    color: "bg-amber-200",
  },
  {
    id: "#ORD-5212",
    customer: "Farah Iqbal",
    amount: "Rs. 4,800",
    date: "16 Jun, 2025",
    status: "Shipped",
    color: "bg-gray-200",
  },
  {
    id: "#ORD-5211",
    customer: "Hamza Ahmed",
    amount: "Rs. 1,650",
    date: "16 Jun, 2025",
    status: "Delivered",
    color: "bg-red-100",
  },
  {
    id: "#ORD-5210",
    customer: "Zainab Akhtar",
    amount: "Rs. 2,950",
    date: "15 Jun, 2025",
    status: "Delivered",
    color: "bg-red-200",
  },
];

const statusColor = {
  Pending: "yellow",
  Processing: "blue",
  Shipped: "purple",
  Delivered: "green",
};

const RecentOrders = () => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          Recent Orders
        </h3>

        <button className="flex items-center text-xs font-medium text-green-700 hover:underline">
          View All
          <ChevronRight size={14} />
        </button>
      </div>

      <ul className="space-y-3">
        {recentOrders.map((order) => (
          <li
            key={order.id}
            className="flex items-center gap-3"
          >
            <span
              className={`h-9 w-9 shrink-0 rounded-lg ${order.color}`}
            />

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

              <p className="text-[11px] text-gray-400">
                {order.date}
              </p>
            </div>

            <Badge color={statusColor[order.status]}>
              {order.status}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentOrders;