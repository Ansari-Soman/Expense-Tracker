import React, { useState, useEffect } from "react";

const ConsoleLoader = ({ message = "LOADING_CONSOLE_MODULES", fullScreen = false }) => {
  const [frameIdx, setFrameIdx] = useState(0);
  const frames = ["/", "-", "\\", "|"];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % frames.length);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center p-6 font-mono text-xs text-[var(--color-primary)] glow-text">
      <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-color)] px-5 py-3 shadow-neon">
        <span className="font-bold text-sm tracking-widest text-[var(--color-primary)]">
          {`[ ${frames[frameIdx]} ]`}
        </span>
        <span className="font-semibold uppercase tracking-wider">
          {message}...
        </span>
      </div>
      <div className="mt-2 text-[9px] text-[var(--text-muted)] tracking-widest animate-pulse">
        $ cat /sys/kernel/debug/finances
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-app)]/85 backdrop-blur-[2px] transition-opacity duration-300">
        {content}
      </div>
    );
  }

  return content;
};

export default ConsoleLoader;
