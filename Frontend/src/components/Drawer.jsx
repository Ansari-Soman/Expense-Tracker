import React, { useEffect } from "react";
import { LuX } from "react-icons/lu";

const Drawer = ({ isOpen, onClose, title, children }) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop with blur */}
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer content sliding from the right */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-lg md:max-w-xl bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl flex flex-col h-full animate-slideInRight"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-app)]/50">
            <div>
              <h3 className="text-sm font-mono font-bold text-[var(--text-main)] uppercase tracking-wide">
                $ open_panel --title "{title}"
              </h3>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                Service logs editor context.
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-app)] border border-transparent hover:border-[var(--border-color)] transition-all duration-150 cursor-pointer"
            >
              <LuX size={16} />
            </button>
          </div>

          {/* Body content */}
          <div className="flex-1 overflow-y-auto p-5 min-h-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
