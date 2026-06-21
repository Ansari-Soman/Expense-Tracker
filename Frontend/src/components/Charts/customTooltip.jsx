import React from "react";

const customTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2 shadow-neon font-mono">
        <p className="text-xs font-semibold text-[var(--color-primary)] mb-1">
          {payload[0].name}
        </p>
        <p className="text-xs text-[var(--text-main)]">
          Amount:{" "}
          <span className="font-bold text-[var(--text-main)]">
            ${payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default customTooltip;
