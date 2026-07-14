import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AreaLineChart = ({ data = [], height = 250 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="value"
          stroke="#22c55e"
          strokeWidth={3}
          fill="url(#salesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaLineChart;