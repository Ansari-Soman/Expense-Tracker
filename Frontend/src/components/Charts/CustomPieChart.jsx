import React, { useContext } from "react";
import {
  Legend,
  Tooltip,
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
} from "recharts";
import customTooltip from "./customTooltip";
import customLegend from "./customLegend";
import { ThemeContext } from "../../context/ThemeContext";

const CustomPieChart = ({
  data,
  label,
  totalAmount,
  colors,
  showTextAnchor,
}) => {
  const { isDark } = useContext(ThemeContext);
  
  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={customTooltip} />
        <Legend content={customLegend}/>

        {showTextAnchor && (
          <>
            <text
              x="50%"
              y="50%"
              dy={-20}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="11px"
              fontFamily="var(--font-sans)"
              fontWeight="600"
              letterSpacing="0.5px"
            >
              {label?.toUpperCase()}
            </text>
            <text
              x="50%"
              y="50%"
              dy={10}
              textAnchor="middle"
              fill="var(--text-main)"
              fontSize="20px"
              fontFamily="var(--font-mono)"
              fontWeight="700"
            >
              {totalAmount}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
