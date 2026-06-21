import React, { useState } from "react";
import CategoryIcon, { ICON_MAP } from "../CategoryIcon";
import { LuPlus, LuX } from "react-icons/lu";

const IconPicker = ({ value, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const iconsList = Object.keys(ICON_MAP);

  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
        Transaction Icon
      </label>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 flex flex-col items-center justify-center rounded-md border text-xl cursor-pointer transition-all duration-150 ${
            value
              ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
              : "border-[var(--border-color)] bg-[var(--bg-app)] hover:border-[var(--color-primary)] text-[var(--text-muted)]"
          }`}
        >
          {value ? <CategoryIcon iconName={value} className="text-xl" /> : <LuPlus />}
        </button>
        
        <div>
          <span className="text-sm font-medium text-[var(--text-main)] capitalize">
            {value ? value : "Select category icon"}
          </span>
          <p className="text-xs text-[var(--text-muted)]">
            Click block to open custom SVG library
          </p>
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md shadow-md animate-fadeIn">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--border-color)]">
            <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wide">
              SVG Developer Icons
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
            >
              <LuX size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {iconsList.map((key) => {
              const isSelected = value?.toLowerCase() === key.toLowerCase();
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onSelect(key);
                    setIsOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                      : "border-[var(--border-color)] bg-[var(--bg-app)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-card)] text-[var(--text-main)]"
                  }`}
                >
                  <CategoryIcon iconName={key} className="text-lg mb-1" />
                  <span className="text-[10px] capitalize tracking-tight font-medium truncate w-full text-center">
                    {key}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
