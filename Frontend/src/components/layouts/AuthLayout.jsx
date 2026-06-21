import AuthIllustration from "../Auth/AuthIllustration";
import ThemeToggle from "../ThemeToggle";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-300 relative">
      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Left Form Panel */}
      <div className="w-full md:w-[55vw] lg:w-[60vw] min-h-screen flex flex-col justify-between p-8 md:p-12 lg:p-16 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-white font-mono font-bold text-sm">
            $
          </div>
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-main)] font-mono">
            EXPENSE_TRACKER.git
          </h2>
        </div>

        <div className="my-auto py-10 flex justify-center">
          {children}
        </div>

        <div className="text-xs text-[var(--text-muted)] font-mono">
          $ cat copyright.txt
          <p>© {new Date().getFullYear()} Expense Tracker. All assets vector-only.</p>
        </div>
      </div>

      {/* Right Visual Panel */}
      <div className="hidden md:flex md:w-[45vw] lg:w-[40vw] h-screen bg-[var(--bg-app)] border-l border-[var(--border-color)] sticky top-0 overflow-hidden items-center justify-center p-8">
        {/* Background grid representation */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

        <div className="w-full max-w-md z-10 flex flex-col items-center">
          <div className="w-full mb-6 max-w-[340px]">
            <StatsInfoCard
              icon={<LuTrendingUpDown />}
              label="Pipeline Analysis"
              value="Deploy Status: OK"
              color="bg-[var(--color-primary-light)] text-[var(--color-primary)]"
            />
          </div>
          <AuthIllustration />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-4 bg-[var(--bg-card)] p-4 rounded-md border border-[var(--border-color)] shadow-sm">
      <div
        className={`w-10 h-10 flex items-center justify-center text-lg ${color} rounded-md border border-[var(--border-color)]`}
      >
        {icon}
      </div>

      <div>
        <h6 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">{label}</h6>
        <span className="text-sm font-bold text-[var(--text-main)] font-mono">{value}</span>
      </div>
    </div>
  );
};
