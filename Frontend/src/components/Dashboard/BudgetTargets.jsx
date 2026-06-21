import React, { useMemo } from "react";
import { LuShieldAlert, LuCircleCheck } from "react-icons/lu";

const DEFAULT_BUDGETS = {
  food: 400,
  shopping: 300,
  rent: 1000,
  entertainment: 200,
  utilities: 250,
  transport: 150,
  others: 200,
};

const BudgetTargets = ({ transactions = [] }) => {
  // Aggregate expenses by category
  const categoryTotals = useMemo(() => {
    const totals = {};
    transactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        const cat = (tx.category || "others").toLowerCase();
        totals[cat] = (totals[cat] || 0) + tx.amount;
      });
    return totals;
  }, [transactions]);

  // Combine category expenses with default budgets
  const budgetList = useMemo(() => {
    const categories = Object.keys(DEFAULT_BUDGETS);
    // Add any category from user transactions not in default list
    Object.keys(categoryTotals).forEach((cat) => {
      if (!categories.includes(cat)) {
        categories.push(cat);
      }
    });

    return categories.map((cat) => {
      const spent = categoryTotals[cat] || 0;
      const budget = DEFAULT_BUDGETS[cat] || 200; // default for unknown
      const ratio = spent / budget;
      const percent = Math.min(Math.round(ratio * 100), 200); // capped at 200% visual
      
      let status = "success"; // green
      if (ratio > 0.9) status = "danger"; // red
      else if (ratio > 0.5) status = "warning"; // yellow

      return {
        category: cat,
        spent,
        budget,
        percent,
        ratio,
        status,
      };
    });
  }, [categoryTotals]);

  // Count breaches
  const breachedCount = budgetList.filter((b) => b.spent > b.budget).length;

  return (
    <div className="card h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <LuShieldAlert className="text-[var(--color-primary)]" size={15} />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              BUDGET_SECTOR_MAP.sys
            </h5>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 bg-black/45 text-[var(--color-primary)] border border-[var(--border-color)]">
            {breachedCount > 0 ? `WARNING: ${breachedCount} BREACHES` : "COMPLIANT"}
          </span>
        </div>

        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
          {budgetList.map((item) => (
            <div key={item.category} className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between items-center text-[10px]">
                <span className="capitalize font-bold text-[var(--text-main)]">
                  📂 {item.category}
                </span>
                <span className="text-[var(--text-muted)]">
                  ${item.spent.toFixed(0)} / <span className="text-[var(--text-main)]">${item.budget}</span>
                </span>
              </div>

              {/* Custom CSS Neon Progress Bar */}
              <div className="neon-progress-container">
                <div
                  className={`neon-progress-bar ${
                    item.status === "danger"
                      ? "neon-progress-bar-danger"
                      : item.status === "warning"
                      ? "neon-progress-bar-warning"
                      : "neon-progress-bar-success"
                  }`}
                  style={{ width: `${Math.min(item.percent, 100)}%` }}
                ></div>
                {item.spent > item.budget && (
                  <div className="absolute right-2 text-[8px] font-bold text-[var(--color-danger)] uppercase animate-pulse">
                    ! BUFFER_OVERFLOW
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border-color)]/25 flex items-center justify-between text-[10px] font-mono">
        <span className="text-[var(--text-muted)]">SYSTEM LIMIT STATS:</span>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[var(--color-success)]">
            <LuCircleCheck size={10} /> Safe (&lt;50%)
          </span>
          <span className="flex items-center gap-1 text-[var(--color-warning)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] shadow-[0_0_4px_var(--color-warning)]"></span> Warn
          </span>
          <span className="flex items-center gap-1 text-[var(--color-danger)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-danger)] shadow-[0_0_4px_var(--color-danger)] animate-ping"></span> Critical
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetTargets;
