import React from "react";
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
const CustomPieChart = ({
  data,
  label,
  totalAmount,
  colors,
  showTextAnchor,
}) => {
  
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
          <Tooltip content={customTooltip} />
          <Legend content={customLegend}/>

          {showTextAnchor && (
            <>
              <text
                x="50%"
                y="50%"
                dy={-25}
                textAnchor="middle"
                fill="#666"
                fontSize="14px"
              >
                {label}
              </text>
              <text
                x="50%"
                y="50%"
                dy={8}
                textAnchor="middle"
                fill="#333"
                fontSize="24px"
                fontWeight="semi-bold"
              >
                {totalAmount}
              </text>
            </>
          )}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
