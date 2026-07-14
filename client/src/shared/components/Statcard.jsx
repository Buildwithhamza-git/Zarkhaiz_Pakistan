import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({
  label,
  value,
  icon: Icon,
  iconBg = "bg-green-100",
  iconColor = "text-green-600",
  trend = 0,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </h2>

          <div className="flex items-center gap-1 mt-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">
              +{trend}%
            </span>

            <span className="text-sm text-gray-400">
              vs last month
            </span>
          </div>
        </div>

        <div
          className={`h-14 w-14 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          {Icon && (
            <Icon className={`w-7 h-7 ${iconColor}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;