import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import CommandPalette from "../CommandPalette";
import ConsoleShell from "../ConsoleShell";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const handleQuickAction = (action) => {
    if (action === "add-income") {
      navigate("/income", { state: { openModal: true } });
    } else if (action === "add-expense") {
      navigate("/expense", { state: { openModal: true } });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-200">
      <Navbar activeMenu={activeMenu} onOpenSearch={() => setIsPaletteOpen(true)} />

      {user && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 overflow-hidden">
          {children}
        </div>
      )}

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onQuickAction={handleQuickAction}
      />

      <ConsoleShell />
    </div>
  );
};

export default DashboardLayout;
