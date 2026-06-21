import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import CategoryIcon from "./CategoryIcon";
import {
  LuSearch,
  LuMoon,
  LuSun,
  LuLayoutDashboard,
  LuCirclePlus,
  LuArrowRight,
  LuCornerDownLeft,
} from "react-icons/lu";

const CommandPalette = ({ isOpen, onClose, onQuickAction }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  // Core actions always available
  const baseActions = [
    {
      id: "nav-dash",
      title: "Go to Dashboard",
      category: "Navigation",
      icon: <LuLayoutDashboard />,
      action: () => navigate("/dashboard"),
    },
    {
      id: "nav-inc",
      title: "Go to Income Sources",
      category: "Navigation",
      icon: <LuArrowRight />,
      action: () => navigate("/income"),
    },
    {
      id: "nav-exp",
      title: "Go to Expense Tracker",
      category: "Navigation",
      icon: <LuArrowRight />,
      action: () => navigate("/expense"),
    },
    {
      id: "nav-diag",
      title: "Go to Terminal Audit Diagnostics",
      category: "Navigation",
      icon: <LuArrowRight />,
      action: () => navigate("/diagnostics"),
    },
    {
      id: "act-theme",
      title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      category: "Preferences",
      icon: theme === "dark" ? <LuSun /> : <LuMoon />,
      action: () => toggleTheme(),
    },
    {
      id: "act-add-inc",
      title: "Quick Add Income",
      category: "Quick Actions",
      icon: <LuCirclePlus className="text-[var(--color-success)]" />,
      action: () => {
        if (onQuickAction) onQuickAction("add-income");
      },
    },
    {
      id: "act-add-exp",
      title: "Quick Add Expense",
      category: "Quick Actions",
      icon: <LuCirclePlus className="text-[var(--color-danger)]" />,
      action: () => {
        if (onQuickAction) onQuickAction("add-expense");
      },
    },
  ];

  // Fetch all transactions to enable searching
  useEffect(() => {
    if (!isOpen) return;

    const fetchAll = async () => {
      try {
        const [incRes, expRes] = await Promise.all([
          axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME).catch(() => ({ data: [] })),
          axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE).catch(() => ({ data: [] })),
        ]);

        const incs = (incRes.data || []).map((t) => ({
          ...t,
          type: "income",
          title: t.source,
          categoryName: "Income",
        }));
        
        const exps = (expRes.data || []).map((t) => ({
          ...t,
          type: "expense",
          title: t.category,
          categoryName: "Expense",
        }));

        setTransactions([...incs, ...exps]);
      } catch (err) {
        console.error("Palette search cache fetch error:", err);
      }
    };

    fetchAll();
    setQuery("");
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  // Filter commands and transactions based on query
  useEffect(() => {
    if (!query) {
      setResults(baseActions);
      return;
    }

    const q = query.toLowerCase();
    const matchedActions = baseActions.filter((a) =>
      a.title.toLowerCase().includes(q)
    );

    const matchedTransactions = transactions
      .filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.amount?.toString().includes(q) ||
          t.categoryName?.toLowerCase().includes(q)
      )
      .slice(0, 5) // Limit transaction results
      .map((t) => ({
        id: t._id,
        title: `${t.type === "income" ? "+" : "-"} $${t.amount} | ${t.title}`,
        category: `Transaction - ${t.categoryName}`,
        icon: <CategoryIcon iconName={t.icon} className={t.type === "income" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"} />,
        action: () => navigate(t.type === "income" ? "/income" : "/expense"),
      }));

    setResults([...matchedActions, ...matchedTransactions]);
    setActiveIndex(0);
  }, [query, transactions]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[activeIndex]) {
          results[activeIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, activeIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]">
      <div 
        className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-2xl overflow-hidden mx-4 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-color)]">
          <LuSearch className="text-[var(--text-muted)] text-lg flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands or transaction items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-sm text-[var(--text-main)] placeholder-[var(--text-muted)]"
          />
          <button 
            onClick={onClose}
            className="text-xs px-2 py-0.5 border border-[var(--border-color)] rounded bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results grid */}
        <div className="max-h-[350px] overflow-y-auto py-2">
          {results.length > 0 ? (
            <div>
              {/* Group items by category */}
              {Array.from(new Set(results.map((r) => r.category))).map((cat) => (
                <div key={cat}>
                  <div className="px-4 py-1 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg-app)]/50">
                    {cat}
                  </div>
                  {results
                    .filter((r) => r.category === cat)
                    .map((item) => {
                      const itemIndex = results.indexOf(item);
                      const isSelected = itemIndex === activeIndex;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            item.action();
                            onClose();
                          }}
                          className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors duration-100 ${
                            isSelected
                              ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
                              : "hover:bg-[var(--bg-app)] text-[var(--text-main)]"
                          }`}
                        >
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-base flex-shrink-0">{item.icon}</span>
                            <span>{item.title}</span>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                              Select <LuCornerDownLeft size={10} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
              No matching commands or transactions found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[var(--bg-app)] border-t border-[var(--border-color)] flex justify-between items-center text-[10px] text-[var(--text-muted)]">
          <div>
            Use <span className="font-semibold">↑↓</span> to navigate, <span className="font-semibold">Enter</span> to select
          </div>
          <div>
            Expense Tracker Console v1.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
