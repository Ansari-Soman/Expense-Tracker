import React from "react";

const AuthIllustration = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center select-none overflow-hidden py-10">
      <svg
        viewBox="0 0 500 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[420px] filter drop-shadow-[0_20px_50px_rgba(47,129,247,0.15)] animate-pulse-slow"
      >
        {/* Background Gradients */}
        <defs>
          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-success)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-success)" />
          </linearGradient>
          <linearGradient id="gitFlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer developer console box */}
        <rect
          x="10"
          y="10"
          width="480"
          height="430"
          rx="12"
          fill="var(--bg-card)"
          stroke="var(--border-color)"
          strokeWidth="2"
        />

        {/* Console Header Bar (GitHub / ServiceNow header mockup) */}
        <rect
          x="10"
          y="10"
          width="480"
          height="45"
          rx="12"
          fill="var(--bg-app)"
          stroke="var(--border-color)"
          strokeWidth="1.5"
        />
        {/* Mac-like Window Controls */}
        <circle cx="35" cy="32" r="6" fill="#f85149" />
        <circle cx="55" cy="32" r="6" fill="#d29922" />
        <circle cx="75" cy="32" r="6" fill="#3fb950" />
        
        {/* Console title tab */}
        <rect x="110" y="20" width="140" height="25" rx="4" fill="var(--bg-card)" stroke="var(--border-color)" />
        <text x="125" y="37" fill="var(--text-main)" fontSize="10.5" fontFamily="var(--font-mono)" fontWeight="500">
          financial-repo.git
        </text>

        {/* Dashboard Grid Lines (ServiceNow list style) */}
        <rect x="30" y="75" width="440" height="340" rx="8" fill="url(#gridGrad)" stroke="var(--border-color)" strokeWidth="1" />

        {/* Top Metric Cards */}
        {/* Card 1: Balance (Commit style count) */}
        <g transform="translate(45, 95)">
          <rect x="0" y="0" width="120" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="1.5" />
          <text x="12" y="20" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.5">
            BAL_BRANCH
          </text>
          <text x="12" y="45" fill="var(--color-primary)" fontSize="16" fontFamily="var(--font-mono)" fontWeight="700">
            $94,520
          </text>
        </g>

        {/* Card 2: Income (Green/Verified) */}
        <g transform="translate(190, 95)">
          <rect x="0" y="0" width="120" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="1.5" />
          <text x="12" y="20" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.5">
            VERIFIED_INCOME
          </text>
          <text x="12" y="45" fill="var(--color-success)" fontSize="16" fontFamily="var(--font-mono)" fontWeight="700">
            +$12,400
          </text>
        </g>

        {/* Card 3: Expense (Red/Fail status) */}
        <g transform="translate(335, 95)">
          <rect x="0" y="0" width="120" height="60" rx="6" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="1.5" />
          <text x="12" y="20" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.5">
            MERGED_EXPENSES
          </text>
          <text x="12" y="45" fill="var(--color-danger)" fontSize="16" fontFamily="var(--font-mono)" fontWeight="700">
            -$4,810
          </text>
        </g>

        {/* Git Branching Graph representation in the center */}
        <g transform="translate(50, 180)">
          {/* Grid lines background */}
          <line x1="0" y1="50" x2="390" y2="50" stroke="var(--border-color)" strokeDasharray="3 3" />
          <line x1="0" y1="90" x2="390" y2="90" stroke="var(--border-color)" strokeDasharray="3 3" />

          {/* Master Branch (Blue Line) */}
          <path d="M 10 50 L 120 50 L 150 90 L 320 90 L 350 50 L 380 50" stroke="var(--color-primary)" strokeWidth="3" fill="none" />
          
          {/* Feature Branch (Income/Expense Flow - green & red lines) */}
          <path d="M 80 50 L 110 10 L 260 10 L 290 50" stroke="var(--color-success)" strokeWidth="2.5" fill="none" strokeDasharray="1" />
          
          {/* Nodes (Commits) */}
          {/* Master Commit */}
          <circle cx="40" cy="50" r="6" fill="var(--bg-card)" stroke="var(--color-primary)" strokeWidth="3" />
          <circle cx="40" cy="50" r="2" fill="var(--color-primary)" />
          
          {/* Income Commit (Green) */}
          <circle cx="150" cy="10" r="7" fill="var(--color-success)" />
          <text x="150" y="3" textAnchor="middle" fill="var(--color-success)" fontSize="8" fontFamily="var(--font-mono)" fontWeight="600">+$2.4K</text>

          {/* Expense Commit (Red) */}
          <circle cx="210" cy="10" r="7" fill="var(--color-danger)" />
          <text x="210" y="3" textAnchor="middle" fill="var(--color-danger)" fontSize="8" fontFamily="var(--font-mono)" fontWeight="600">-$800</text>

          {/* Branch Junction Nodes */}
          <circle cx="120" cy="50" r="5" fill="var(--color-primary)" />
          <circle cx="150" cy="90" r="5" fill="var(--color-primary)" />
          <circle cx="320" cy="90" r="5" fill="var(--color-primary)" />
          <circle cx="350" cy="50" r="5" fill="var(--color-primary)" />

          {/* Animated node pulsing */}
          <circle cx="280" cy="90" r="6" fill="var(--color-primary)" />
          <circle cx="280" cy="90" r="14" stroke="var(--color-primary)" strokeWidth="1.5" strokeOpacity="0.4" className="animate-ping" style={{ transformOrigin: "280px 90px" }} />
        </g>

        {/* Git Contribution Heatmap Grid (Bottom section) */}
        <g transform="translate(45, 305)">
          <text x="0" y="-10" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-sans)" fontWeight="600">
            COMMIT ACTIVITY OVERVIEW
          </text>
          
          {/* Mini Calendar cells */}
          {Array.from({ length: 18 }).map((_, colIndex) => (
            <g key={colIndex} transform={`translate(${colIndex * 22}, 0)`}>
              {Array.from({ length: 4 }).map((_, rowIndex) => {
                // Determine block color randomly but static-looking for the illustration
                let colorClass = "fill-[var(--border-color)]";
                if ((colIndex + rowIndex) % 5 === 0) {
                  colorClass = "fill-[var(--color-success)] opacity-70";
                } else if ((colIndex * rowIndex) % 7 === 3) {
                  colorClass = "fill-[var(--color-primary)] opacity-80";
                } else if ((colIndex + rowIndex) % 9 === 1) {
                  colorClass = "fill-[var(--color-danger)] opacity-70";
                }
                
                return (
                  <rect
                    key={rowIndex}
                    x="0"
                    y={rowIndex * 18}
                    width="16"
                    height="16"
                    rx="3"
                    className={colorClass}
                  />
                );
              })}
            </g>
          ))}
        </g>
      </svg>

      <div className="text-center mt-4 px-6">
        <h4 className="text-md font-semibold text-[var(--text-main)] mb-1 tracking-tight">
          High-Density Data Repository
        </h4>
        <p className="text-xs text-[var(--text-muted)] max-w-[300px] leading-relaxed">
          Manage your accounts like software modules. Track balances, index sources, and visualize trends dynamically.
        </p>
      </div>
    </div>
  );
};

export default AuthIllustration;
