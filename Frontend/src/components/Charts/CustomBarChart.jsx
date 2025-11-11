import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data = [] }) => {
  // Decide which field to use for X-axis dynamically
  const detectXKey = () => {
    if (data.length === 0) return "category";
    const firstItem = data[0];
    if ("category" in firstItem) return "category";
    if ("source" in firstItem) return "source";
    if ("month" in firstItem) return "month";
    return Object.keys(firstItem)[0]; // fallback to first key
  };

  const xKey = detectXKey();

  // Alternate bar colors
  const getBarColor = (index) => (index % 2 === 0 ? "#875cf5" : "#cfbefb");

  // Custom tooltip design
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const label = item.source || item.category || item.month || "Unknown";

      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-200">
          <p className="text-xs font-semibold text-purple-800 mb-1">{label}</p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="text-sm font-medium text-gray-900">
              {item.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6 p-4 rounded-xl shadow-sm">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          barSize={40}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
            axisLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }} // removes gray hover overlay
          />
          <Bar dataKey="amount" radius={[10, 10, 0, 0]} animationDuration={800}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
