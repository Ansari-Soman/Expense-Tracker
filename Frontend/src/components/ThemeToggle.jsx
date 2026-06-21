import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { LuSun, LuMoon } from "react-icons/lu";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-[var(--bg-app)] hover:bg-[var(--bg-card)] text-[var(--text-main)] transition-all duration-150 border border-[var(--border-color)] cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
      aria-label="Toggle Theme"
      type="button"
    >
      {theme === "dark" ? (
        <LuSun className="text-sm text-amber-500 transition-all" />
      ) : (
        <LuMoon className="text-sm text-indigo-500 transition-all" />
      )}
    </button>
  );
};

export default ThemeToggle;
