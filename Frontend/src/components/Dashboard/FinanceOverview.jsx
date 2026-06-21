import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["var(--color-primary)", "var(--color-danger)", "var(--color-success)"]; // Primary, Danger, Success theme colors
const FinanceOverview = ({ totalBalance, totalExpense, totalIncome }) => {
  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Expense", amount: totalExpense },
    { name: "Total Income", amount: totalIncome },
  ];
  return (
    <div className="card">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h5 className="text-sm font-mono font-bold text-[var(--text-main)] uppercase tracking-wide">Finance Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`$${totalBalance}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
