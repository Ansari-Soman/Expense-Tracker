import React, { useContext } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { ThemeContext } from "../../context/ThemeContext";

const CustomLineChart = ({ data }) => {
  const { isDark } = useContext(ThemeContext);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2 shadow-neon font-mono">
          <p className="text-xs font-semibold text-[var(--color-primary)] mb-1">
            {payload[0].payload.category || payload[0].payload.source || "Category"}
          </p>
          <p className="text-xs text-[var(--text-main)]">
            Amount:{" "}
            <span className="font-bold text-[var(--text-main)]">
              ${payload[0].payload.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-transparent mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 2" stroke="var(--border-color)" opacity={0.4} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            stroke="var(--border-color)"
          />
          <YAxis 
            tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }} 
            stroke="var(--border-color)" 
            axisLine={true}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="var(--color-primary)"
            fill="url(#incomeGradient)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--color-primary)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
