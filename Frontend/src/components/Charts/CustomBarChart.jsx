import React, { useContext } from "react";
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
import { ThemeContext } from "../../context/ThemeContext";

const CustomBarChart = ({ data = [] }) => {
  const { isDark } = useContext(ThemeContext);

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
  const getBarColor = (index) => (index % 2 === 0 ? "var(--color-primary)" : "var(--text-muted)");

  // Custom tooltip design
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const label = item.source || item.category || item.month || "Unknown";

      return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2 shadow-neon font-mono">
          <p className="text-xs font-semibold text-[var(--color-primary)] mb-1">{label}</p>
          <p className="text-xs text-[var(--text-main)]">
            Amount:{" "}
            <span className="font-bold text-[var(--text-main)]">
              ${item.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-transparent mt-6 p-0 border-none transition-colors duration-300">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          barSize={32}
          margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="2 2" stroke="var(--border-color)" opacity={0.4} vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            stroke="var(--border-color)"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            stroke="var(--border-color)"
            axisLine={true}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--color-primary-light)" }}
          />
          <Bar dataKey="amount" radius={0} animationDuration={800}>
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
