import React, { useState } from "react";
import { LuTrash2, LuCalendar, LuTag, LuCreditCard, LuChevronDown, LuChevronUp } from "react-icons/lu";
import CategoryIcon, { ICON_MAP } from "../CategoryIcon";

const TransactionInfoCard = ({
  id,
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
  description,
  paymentMethod,
}) => {
  const [expanded, setExpanded] = useState(false);

  const renderIcon = () => {
    const iconLower = icon?.toLowerCase();
    const titleLower = title?.toLowerCase();
    
    if (icon && ICON_MAP[iconLower]) {
      return <CategoryIcon iconName={icon} />;
    }
    if (title && ICON_MAP[titleLower]) {
      return <CategoryIcon iconName={title} />;
    }
    if (icon && icon.trim().length > 0) {
      return <span className="text-base select-none">{icon}</span>;
    }
    return <CategoryIcon iconName="other" />;
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-primary)]/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 animate-row-in mb-3 flex flex-col gap-3 group">
      {/* Top Main Section */}
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Icon and Info */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
              type === "income"
                ? "bg-[var(--color-success-light)] text-[var(--color-success)]"
                : "bg-[var(--color-danger-light)] text-[var(--color-danger)]"
            }`}
          >
            {renderIcon()}
          </div>

          <div className="min-w-0">
            <h6 className="font-semibold text-sm text-[var(--text-main)] truncate capitalize">
              {title}
            </h6>
            <div className="flex flex-wrap items-center gap-2 mt-1 select-none">
              <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-medium">
                <LuCalendar size={11} />
                {date}
              </span>
              {paymentMethod && (
                <>
                  <span className="text-[10px] text-[var(--text-muted)] opacity-40">•</span>
                  <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-medium bg-[var(--bg-app)] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                    <LuCreditCard size={11} />
                    {paymentMethod}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Amount and Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <span
              className={`text-base font-bold tracking-tight ${
                type === "income" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
              }`}
            >
              {type === "income" ? "+" : "-"} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Expand Memo Trigger */}
            {description && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border-color)] hover:border-[var(--color-primary)] text-[var(--text-muted)] hover:text-[var(--color-primary)] bg-[var(--bg-app)]/50 cursor-pointer transition-colors duration-150"
                title="View memo description"
              >
                {expanded ? <LuChevronUp size={14} /> : <LuChevronDown size={14} />}
              </button>
            )}

            {/* Delete button */}
            {!hideDeleteBtn && (
              <button
                type="button"
                onClick={onDelete}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border-color)] hover:border-[var(--color-danger)] text-[var(--text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] cursor-pointer transition-colors duration-150"
                title="Delete transaction record"
              >
                <LuTrash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Description Memo Panel */}
      {expanded && description && (
        <div className="bg-[var(--bg-app)]/60 border border-[var(--border-color)] rounded-xl p-3 text-xs text-[var(--text-muted)] leading-relaxed animate-scaleUp">
          <span className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-main)] block mb-1">
            Memo Notes:
          </span>
          <p className="italic font-medium">"{description}"</p>
        </div>
      )}
    </div>
  );
};

export default TransactionInfoCard;
