import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { LuTerminal, LuX } from "react-icons/lu";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import toast from "react-hot-toast";

const ConsoleShell = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { demoDataEnabled, toggleDemoData } = useContext(UserContext);

  const [isOpen, setIsOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([
    { type: "output", text: "APEX_SHELL.v1 [Session Ready]" },
    { type: "output", text: "Type 'help' to query active controllers." },
  ]);

  const historyEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom of logs
  useEffect(() => {
    if (isOpen) {
      historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, cmdHistory]);

  // Global hotkey listener (backtick '~' key opens/closes CLI prompt)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    const cmdClean = currentInput.trim();
    if (!cmdClean) return;

    // Append input command to logs
    const newLogs = [...cmdHistory, { type: "input", text: `guest@aura:~$ ${cmdClean}` }];
    
    // Parse arguments
    const cmdArgs = cmdClean.split(" ");
    const primaryCmd = cmdArgs[0].toLowerCase();

    switch (primaryCmd) {
      case "help":
        newLogs.push({
          type: "output",
          text: `SUPPORTED CLI CONTROLLERS:
------------------------------------------------
help               Show this command directory list
clear              Flush console terminal histories
theme <l|d>        Set theme: Light (l) or Dark (d)
sandbox <on|off>   Toggle mock database logs stream
list <inc|exp>     Output latest transaction items
add <inc|exp> <val> <cat> [desc]  Log new transaction
diagnostics        Jump route to Health Scan analyzer
exit               Close terminal console drawer`,
        });
        break;

      case "clear":
        setCmdHistory([]);
        setCurrentInput("");
        return;

      case "exit":
        setIsOpen(false);
        setCurrentInput("");
        return;

      case "diagnostics":
        newLogs.push({ type: "output", text: "[CLI] Routing parameters to Diagnostics page..." });
        navigate("/diagnostics");
        break;

      case "theme":
        const subTheme = cmdArgs[1]?.toLowerCase();
        if (subTheme === "l" || subTheme === "light") {
          if (theme !== "light") toggleTheme();
          newLogs.push({ type: "output", text: "[SYS] Applied Light theme variable sheets." });
        } else if (subTheme === "d" || subTheme === "dark") {
          if (theme !== "dark") toggleTheme();
          newLogs.push({ type: "output", text: "[SYS] Applied Obsidian Cyberpunk theme sheets." });
        } else {
          newLogs.push({ type: "error", text: "Usage error: theme <l|d> (light or dark)" });
        }
        break;

      case "sandbox":
        const subSand = cmdArgs[1]?.toLowerCase();
        if (subSand === "on") {
          if (!demoDataEnabled) toggleDemoData();
          newLogs.push({ type: "output", text: "[SYS] Sandbox Mode enabled. Mock records loaded." });
        } else if (subSand === "off") {
          if (demoDataEnabled) toggleDemoData();
          newLogs.push({ type: "output", text: "[SYS] Sandbox Mode disabled. Fetching database records..." });
        } else {
          newLogs.push({ type: "error", text: "Usage: sandbox <on|off>" });
        }
        break;

      case "list":
        const subList = cmdArgs[1]?.toLowerCase();
        if (subList === "inc" || subList === "income") {
          newLogs.push({ type: "output", text: "[SYS] Querying INCOME ledger stream..." });
          try {
            const res = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
            const data = res.data || [];
            if (data.length === 0) {
              newLogs.push({ type: "output", text: "EMPTY SET: No income logs found in DB." });
            } else {
              let out = "DATE         SOURCE               AMOUNT\n------------------------------------------------";
              data.slice(0, 8).forEach((item) => {
                const dateStr = new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
                const srcStr = (item.source || "Unknown").substring(0, 18).padEnd(20);
                const amtStr = `$${item.amount.toFixed(2)}`;
                out += `\n${dateStr.padEnd(12)}${srcStr}${amtStr}`;
              });
              if (data.length > 8) out += `\n... (+${data.length - 8} more entries)`;
              newLogs.push({ type: "output", text: out });
            }
          } catch (err) {
            newLogs.push({ type: "error", text: `[ERROR] Failed to query DB: ${err.message}` });
          }
        } else if (subList === "exp" || subList === "expense") {
          newLogs.push({ type: "output", text: "[SYS] Querying EXPENSE ledger stream..." });
          try {
            const res = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
            const data = res.data || [];
            if (data.length === 0) {
              newLogs.push({ type: "output", text: "EMPTY SET: No expense logs found in DB." });
            } else {
              let out = "DATE         CATEGORY             AMOUNT\n------------------------------------------------";
              data.slice(0, 8).forEach((item) => {
                const dateStr = new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
                const catStr = (item.category || "Unknown").substring(0, 18).padEnd(20);
                const amtStr = `-$${item.amount.toFixed(2)}`;
                out += `\n${dateStr.padEnd(12)}${catStr}${amtStr}`;
              });
              if (data.length > 8) out += `\n... (+${data.length - 8} more entries)`;
              newLogs.push({ type: "output", text: out });
            }
          } catch (err) {
            newLogs.push({ type: "error", text: `[ERROR] Failed to query DB: ${err.message}` });
          }
        } else {
          newLogs.push({ type: "error", text: "Usage: list <inc|exp>" });
        }
        break;

      case "add":
        const subAdd = cmdArgs[1]?.toLowerCase();
        const amount = parseFloat(cmdArgs[2]);
        const name = cmdArgs[3];
        const desc = cmdArgs.slice(4).join(" ") || "CLI logged transaction";

        if ((subAdd !== "inc" && subAdd !== "income" && subAdd !== "exp" && subAdd !== "expense") || isNaN(amount) || !name) {
          newLogs.push({ type: "error", text: "Usage: add <inc|exp> <amount> <category/source> [description]" });
        } else {
          if (subAdd === "inc" || subAdd === "income") {
            newLogs.push({ type: "output", text: `[SYS] Executing insert command for INCOME: $${amount} -> ${name}...` });
            try {
              await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                amount,
                source: name,
                date: new Date(),
                description: desc,
                paymentMethod: "Cash",
              });
              toast.success("Income added via CLI");
              newLogs.push({ type: "output", text: "[SYS] Record created. Reloading database ledger stream..." });
              setTimeout(() => window.location.reload(), 1200);
            } catch (err) {
              newLogs.push({ type: "error", text: `[API ERROR] Insert rejected: ${err.response?.data?.message || err.message}` });
            }
          } else {
            newLogs.push({ type: "output", text: `[SYS] Executing insert command for EXPENSE: $${amount} -> ${name}...` });
            try {
              await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
                amount,
                category: name,
                date: new Date(),
                description: desc,
                paymentMethod: "Cash",
              });
              toast.success("Expense added via CLI");
              newLogs.push({ type: "output", text: "[SYS] Record created. Reloading database ledger stream..." });
              setTimeout(() => window.location.reload(), 1200);
            } catch (err) {
              newLogs.push({ type: "error", text: `[API ERROR] Insert rejected: ${err.response?.data?.message || err.message}` });
            }
          }
        }
        break;

      default:
        newLogs.push({
          type: "error",
          text: `-bash: command not found: ${primaryCmd}. Type 'help' for directory.`,
        });
        break;
    }

    setCmdHistory(newLogs);
    setCurrentInput("");
  };

  return (
    <>
      {/* Floating Toggle Terminal Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-warning)] hover:from-[var(--color-primary-hover)] hover:to-[var(--color-primary)] text-white flex items-center justify-center rounded-2xl shadow-lg shadow-amber-500/10 cursor-pointer z-40 transition-all duration-200 active:scale-90"
        title="Toggle CLI (Hotkey: ~)"
      >
        <LuTerminal size={18} />
      </button>

      {/* Slide-over Console Drawer */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-6 w-[92%] sm:w-[480px] h-[320px] bg-slate-900/90 text-slate-100 border border-slate-700/50 backdrop-blur-md z-50 flex flex-col font-mono text-xs shadow-2xl rounded-2xl animate-scaleUp overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-950/80 text-[10px] text-slate-400 select-none">
            <span className="flex items-center gap-1.5 font-semibold">
              <LuTerminal size={12} className="text-[var(--color-primary)]" />
              <span>guest@aura:~$ shell --terminal</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <LuX size={14} />
            </button>
          </div>

          {/* History Output Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
            {cmdHistory.map((log, idx) => (
              <div
                key={idx}
                className={`whitespace-pre-wrap leading-relaxed ${
                  log.type === "input"
                    ? "text-[var(--color-primary)]"
                    : log.type === "error"
                    ? "text-[var(--color-danger)]"
                    : "text-emerald-400 opacity-95"
                }`}
              >
                {log.text}
              </div>
            ))}
            <div ref={historyEndRef} />
          </div>

          {/* Prompt Entry Input Form */}
          <form 
            onSubmit={handleCommandSubmit}
            className="flex items-center gap-1.5 px-4 py-2.5 border-t border-slate-700/50 bg-slate-950/40 select-none"
          >
            <span className="text-[var(--color-primary)] font-bold">guest@aura:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="grow bg-transparent border-0 outline-none text-slate-100 caret-[var(--color-primary)] font-mono text-xs"
              placeholder="type commands..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </form>
        </div>
      )}
    </>
  );
};

export default ConsoleShell;
