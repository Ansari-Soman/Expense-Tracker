import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-4 bg-[var(--bg-card)] p-4 rounded-md border border-[var(--border-color)] shadow-sm transition-all duration-150 hover:scale-[1.01] hover:border-[var(--color-primary)]">
      <div
        className={`w-10 h-10 flex items-center justify-center text-lg ${color} rounded-md border border-[var(--border-color)]/25`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">{label}</h6>
        <span className="text-xl font-bold text-[var(--text-main)] font-mono">${value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
