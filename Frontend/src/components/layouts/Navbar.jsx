import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import { LuSearch, LuLogOut, LuWallet } from "react-icons/lu";
import { UserContext } from "../../context/UserContext";

const Navbar = ({ activeMenu, onOpenSearch }) => {
  const navigate = useNavigate();
  const { demoDataEnabled, toggleDemoData, clearUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", activeKey: "Dashboard" },
    { label: "Income", path: "/income", activeKey: "Income" },
    { label: "Expense", path: "/expense", activeKey: "Expense" },
    { label: "Diagnostics", path: "/diagnostics", activeKey: "Diagnostics" },
  ];

  return (
    <div className="flex flex-col bg-[var(--bg-card)] border-b border-[var(--border-color)] sticky top-0 z-30 transition-colors duration-250 backdrop-blur-md bg-opacity-75">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-3.5 px-6 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-warning)] flex items-center justify-center text-white shadow-md shadow-amber-500/10">
            <LuWallet size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-main)] leading-none tracking-tight">
              Aura Finance
            </h2>
            <span className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5 block">
              Smart Ledger System
            </span>
          </div>
        </div>

        {/* Search Input in Navbar */}
        <div 
          onClick={onOpenSearch}
          className="hidden md:flex items-center justify-between gap-3 bg-[var(--bg-app)] border border-[var(--border-color)] hover:border-[var(--color-primary)]/50 px-4 py-2 w-64 text-[var(--text-muted)] text-xs cursor-pointer transition-all duration-150 select-none rounded-xl"
        >
          <div className="flex items-center gap-2">
            <LuSearch size={14} className="text-[var(--text-muted)]" />
            <span>Search transactions...</span>
          </div>
          <span className="text-[10px] border border-[var(--border-color)] px-1.5 py-0.5 rounded-md bg-[var(--bg-card)] shadow-sm font-medium">
            Ctrl K
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile search icon */}
          <button 
            onClick={onOpenSearch}
            className="block md:hidden text-[var(--text-main)] p-2 hover:bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl cursor-pointer"
          >
            <LuSearch size={14} />
          </button>

          {/* Sandbox Switch */}
          <label className="flex items-center gap-2 cursor-pointer text-[10px] font-semibold border border-[var(--border-color)] px-3 py-1.5 rounded-xl bg-[var(--bg-app)] hover:bg-[var(--bg-card)] transition-colors duration-150">
            <input
              type="checkbox"
              checked={demoDataEnabled}
              onChange={toggleDemoData}
              className="accent-[var(--color-primary)] cursor-pointer w-3.5 h-3.5 rounded"
            />
            <span className="text-[var(--text-muted)]">Demo Simulation</span>
          </label>

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold border border-[var(--border-color)] hover:border-[var(--color-danger)]/50 px-3 py-1.5 rounded-xl bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-all duration-150 cursor-pointer"
            title="Terminate Session"
          >
            <LuLogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 px-6 py-1.5 bg-[var(--bg-card)] overflow-x-auto select-none">
        {navItems.map((item) => {
          const isActive = activeMenu === item.activeKey;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-all duration-200 ${
                isActive
                  ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-app)]/50"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
