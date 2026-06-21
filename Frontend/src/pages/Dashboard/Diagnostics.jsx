import React, { useEffect, useState, useMemo, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/userAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/UserContext";
import { MOCK_INCOMES, MOCK_EXPENSES } from "../../utils/mockData";
import { LuPlay, LuDownload, LuTriangleAlert, LuCircleCheck, LuTrendingUp, LuShieldAlert } from "react-icons/lu";

const Diagnostics = () => {
  useUserAuth();
  const { demoDataEnabled } = useContext(UserContext);

  const [loadingData, setLoadingData] = useState(false);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  // Budget threshold cap (persisted in localStorage)
  const [threshold, setThreshold] = useState(() => {
    const saved = localStorage.getItem("budget_threshold");
    return saved ? Number(saved) : 1200;
  });

  // Terminal scan states
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [incRes, expRes] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME).catch(() => ({ data: [] })),
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE).catch(() => ({ data: [] })),
      ]);
      setIncomeList(incRes.data || []);
      setExpenseList(expRes.data || []);
    } catch (err) {
      console.error("Diagnostics cache prefetch error:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Use mock data if sandbox mode is active or database is empty
  const activeIncomes = (demoDataEnabled || (!loadingData && incomeList.length === 0)) ? MOCK_INCOMES : incomeList;
  const activeExpenses = (demoDataEnabled || (!loadingData && expenseList.length === 0)) ? MOCK_EXPENSES : expenseList;

  // Analysis calculations
  const analysis = useMemo(() => {
    const totalIncome = activeIncomes.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = activeExpenses.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    
    // Savings Rate
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    // Monthly burn rate calculation
    let monthsRange = 1;
    if (activeExpenses.length > 0) {
      const dates = activeExpenses.map((e) => new Date(e.date));
      const maxDate = new Date(Math.max(...dates));
      const minDate = new Date(Math.min(...dates));
      const diffTime = Math.abs(maxDate - minDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      monthsRange = Math.max(1, diffDays / 30.4);
    }
    const monthlyBurnRate = totalExpense / monthsRange;

    // Cash Runway
    const runwayMonths = monthlyBurnRate > 0 && balance > 0 ? balance / monthlyBurnRate : 0;

    // Highest expense category grouping
    const categoryMap = {};
    activeExpenses.forEach((exp) => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    });
    let topCategory = "N/A";
    let topCategoryAmount = 0;
    Object.entries(categoryMap).forEach(([cat, val]) => {
      if (val > topCategoryAmount) {
        topCategoryAmount = val;
        topCategory = cat;
      }
    });

    // Check for spikes (transactions > $250 or 2x the average)
    const avgExpense = activeExpenses.length > 0 ? totalExpense / activeExpenses.length : 0;
    const spikeThreshold = Math.max(250, avgExpense * 2);
    const transactionSpikes = activeExpenses.filter((e) => e.amount > spikeThreshold);

    // Budget Cap Breached
    const isBreached = totalExpense > threshold;
    const breachAmount = totalExpense - threshold;

    // Health Score calculation (0 - 100)
    let score = 55;
    if (savingsRate > 25) score += 20;
    else if (savingsRate > 0) score += 10;
    else score -= 15;

    if (runwayMonths >= 6) score += 20;
    else if (runwayMonths >= 3) score += 10;
    else score -= 10;

    if (!isBreached) score += 10;
    else score -= 15;

    if (score > 100) score = 100;
    if (score < 5) score = 5;

    return {
      totalIncome,
      totalExpense,
      balance,
      savingsRate: savingsRate.toFixed(1),
      monthlyBurnRate: monthlyBurnRate.toFixed(2),
      runwayMonths: runwayMonths.toFixed(1),
      topCategory,
      topCategoryPercentage: totalExpense > 0 ? ((topCategoryAmount / totalExpense) * 100).toFixed(1) : 0,
      transactionSpikes,
      isBreached,
      breachAmount: breachAmount.toFixed(2),
      healthScore: Math.round(score),
    };
  }, [activeIncomes, activeExpenses, threshold]);

  // Handle threshold change
  const handleThresholdChange = (val) => {
    const numVal = Math.max(0, Number(val) || 0);
    setThreshold(numVal);
    localStorage.setItem("budget_threshold", numVal);
  };

  // Run the terminal scan simulation
  const startDiagnosticScan = () => {
    setScanning(true);
    setScanProgress(0);
    setShowResults(false);
    setScanLogs([]);

    const logMessages = [
      { prg: 0, msg: "$ run_diagnostics --src db_matrix --level deep" },
      { prg: 10, msg: "[INIT] Establishing connection stream to MongoDB matrix..." },
      { prg: 20, msg: "[INIT] Connected. Data stream synchronized." },
      { prg: 35, msg: `[DATA] Querying incomes. Loaded ${activeIncomes.length} records into cache.` },
      { prg: 50, msg: `[DATA] Querying expenses. Loaded ${activeExpenses.length} records into cache.` },
      { prg: 65, msg: "[ALGO] Executing financial health and runways estimators..." },
      { prg: 75, msg: `[ALGO] Comparing total expense against budget limit ($${threshold})...` },
      { prg: 88, msg: "[ALGO] Running volatility and spike triggers..." },
      { prg: 95, msg: "[SUCCESS] Diagnostics compile complete. Output buffers populated." },
      { prg: 100, msg: "$ cat /dev/stdout --format report_log" },
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setScanProgress(currentProgress);

      // Add corresponding logs
      const matched = logMessages.find((item) => item.prg === currentProgress);
      if (matched) {
        setScanLogs((prev) => [...prev, matched.msg]);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setScanning(false);
          setShowResults(true);
        }, 300);
      }
    }, 120);
  };

  // Generate and download audit report txt file
  const downloadReport = () => {
    const isDarkTheme = document.documentElement.classList.contains("dark");
    const reportText = `==================================================
        FINANCIAL HEALTH DIAGNOSTIC AUDIT LOG
==================================================
Timestamp: ${new Date().toLocaleString()}
Mode: ${demoDataEnabled ? "Sandbox Simulation Mode" : "User Database Mode"}
Security Layer: active_sandbox
--------------------------------------------------

1. CORE FINANCIAL METRICS:
   - Total Cached Income:  $${analysis.totalIncome.toFixed(2)}
   - Total Cached Expenses: $${analysis.totalExpense.toFixed(2)}
   - Net Inflow Balance:   $${analysis.balance.toFixed(2)}
   - Savings to Inflow:    ${analysis.savingsRate}%

2. HEALTH & SUSTAINABILITY LOGS:
   - Monthly Burn Rate:    $${analysis.monthlyBurnRate}/month
   - Estimated Cash Runway: ${analysis.runwayMonths} months (no new income)
   - Highest Burn Sector:  Category "${analysis.topCategory}" (${analysis.topCategoryPercentage}% of total spending)

3. SYSTEM ALERTS & VERIFICATIONS:
   - Budget Threshold:     $${threshold.toFixed(2)}
   - Limit Status:         ${
     analysis.isBreached
       ? `WARNING [LIMIT BREACHED] Exceeded by $${analysis.breachAmount}`
       : "NORMAL OPERATION [SAFE]"
   }
   - Transaction Spikes:   ${
     analysis.transactionSpikes.length > 0
       ? `${analysis.transactionSpikes.length} volatile spike(s) detected:
${analysis.transactionSpikes.map((e) => `     -> [${e.date}] $${e.amount} in category "${e.category}"`).join("\n")}`
       : "None detected [OK]"
   }

--------------------------------------------------
OVERALL HEALTH SCORE: ${analysis.healthScore}/100
Rating: ${
      analysis.healthScore >= 80
        ? "Excellent (Stable Runway)"
        : analysis.healthScore >= 50
        ? "Moderate (Monitor Burn Rate)"
        : "Critical (Immediate Budget Adjustment Required)"
    }
==================================================`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial_diagnostic_audit_report_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout activeMenu="Diagnostics">
      <div className="my-5 mx-auto max-w-4xl font-mono">
        {demoDataEnabled && (
          <div className="mb-4 p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[10px] rounded border border-[var(--color-primary)]/20 flex items-center justify-between">
            <span>$ sandbox_status --mode sandbox_simulation_active</span>
            <span>[SIMULATING DATA]</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Diagnostic Controls Card */}
          <div className="card md:col-span-1 flex flex-col justify-between">
            <div>
              <div className="border-b border-[var(--border-color)] pb-3 mb-4">
                <h5 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide">
                  Scan Configuration
                </h5>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">
                  Adjust parameter bounds before booting calculations.
                </p>
              </div>

              {/* Threshold input box */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Monthly Budget Limit ($)
                </label>
                <div className="input-box bg-[var(--bg-card)]">
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => handleThresholdChange(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs"
                    placeholder="e.g. 1000"
                  />
                </div>
                <p className="text-[9px] text-[var(--text-muted)] leading-normal">
                  Systems evaluate total monthly expense flags against this cap value.
                </p>
              </div>
            </div>

            <button
              onClick={startDiagnosticScan}
              disabled={scanning}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <LuPlay size={12} className={scanning ? "animate-spin" : ""} />
              <span>{scanning ? "Calculating..." : "Boot Diagnostics"}</span>
            </button>
          </div>

          {/* Terminal Screen Card */}
          <div className="card md:col-span-2 min-h-[250px] bg-black text-[#00f5ff] border-[var(--border-color)] flex flex-col relative overflow-hidden">
            {/* scanline screen overlay effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.015),rgba(0,255,0,0.005),rgba(0,0,255,0.015))] bg-[length:100%_4px,6px_100%] opacity-40"></div>
            
            <div className="flex items-center justify-between border-b border-[var(--border-color)]/30 pb-2 mb-3 text-[10px] text-[var(--text-muted)]">
              <span>FINANCE_SHELL.v1:/dev/diagnostics</span>
              <span>online</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[190px] pr-1 scrollbar-thin select-text">
              {scanLogs.length === 0 && !scanning && !showResults && (
                <div className="text-[var(--text-muted)] text-[11px] h-full flex flex-col items-center justify-center text-center mt-6">
                  <LuPlay size={24} className="opacity-40 mb-2" />
                  <p className="font-bold tracking-wider">SYSTEM_STANDBY</p>
                  <p className="text-[9px] mt-1 opacity-70">
                    Click "Boot Diagnostics" to initiate hardware analysis.
                  </p>
                </div>
              )}

              {scanLogs.map((log, idx) => (
                <div key={idx} className="text-[11px] tracking-wide font-mono glow-text">
                  {log}
                </div>
              ))}

              {scanning && (
                <div className="mt-4 text-[11px]">
                  <div className="flex justify-between mb-1">
                    <span>Progress Matrix</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 border border-[var(--border-color)] h-3 p-[1px]">
                    <div
                      className="bg-[#00f5ff] h-full transition-all duration-100 shadow-[0_0_8px_#00f5ff]"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {showResults && (
                <div className="mt-2 space-y-3 animate-row-in">
                  <div className="flex items-center justify-between border-y border-[var(--border-color)]/30 py-2 bg-slate-900/40">
                    <span className="font-bold tracking-wider uppercase text-[var(--color-primary)]">
                      SCAN COMPLETE:
                    </span>
                    <div className="flex items-center gap-2 px-2.5 py-0.5 border border-[#00f5ff] bg-[#00f5ff]/10">
                      <span className="text-xs font-bold font-mono">
                        HEALTH_SCORE: {analysis.healthScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[11px]">
                    <div>
                      <span className="text-[var(--text-muted)] block">Savings rate:</span>
                      <span className={`font-bold ${Number(analysis.savingsRate) >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
                        {analysis.savingsRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block">Cash Runway:</span>
                      <span className="font-bold text-[var(--text-main)]">
                        {analysis.runwayMonths} Months
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block">Burn Sector:</span>
                      <span className="font-bold text-[var(--text-main)]">
                        {analysis.topCategory} ({analysis.topCategoryPercentage}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block">Volatile Spikes:</span>
                      <span className={`font-bold ${analysis.transactionSpikes.length > 0 ? "text-[var(--color-warning)]" : "text-[var(--color-success)]"}`}>
                        {analysis.transactionSpikes.length} Spike Warnings
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Diagnostic Results Dashboard Summary */}
        {showResults && (
          <div className="space-y-6 animate-row-in">
            {/* Threshold Warning Banner */}
            {analysis.isBreached ? (
              <div className="p-3 bg-[var(--color-danger-light)] text-[var(--color-danger)] border border-[var(--color-danger)] flex items-center gap-3">
                <LuShieldAlert className="text-lg flex-shrink-0 animate-bounce" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-bold uppercase tracking-wider">
                    $ alert --code BUDGET_CAP_EXCEEDED
                  </p>
                  <p className="mt-0.5">
                    Monthly spending (${analysis.totalExpense.toFixed(2)}) has breached the designated limit cap (${threshold.toFixed(2)}) by <span className="font-bold">${analysis.breachAmount}</span>. Immediate operational burn reduction recommended.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)] flex items-center gap-3">
                <LuCircleCheck className="text-lg flex-shrink-0" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-bold uppercase tracking-wider">
                    $ check --code BUDGET_STATUS_OK
                  </p>
                  <p className="mt-0.5">
                    Monthly spending is currently compliant. Total expenses (${analysis.totalExpense.toFixed(2)}) are within the designated parameter bounds (${threshold.toFixed(2)}).
                  </p>
                </div>
              </div>
            )}

            {/* In-depth Diagnosis cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Runway and Rate Analyzer */}
              <div className="card">
                <div className="border-b border-[var(--border-color)] pb-2.5 mb-4 flex items-center gap-2 text-[var(--text-main)]">
                  <LuTrendingUp size={14} className="text-[var(--color-primary)]" />
                  <h6 className="text-xs font-bold uppercase">Runway & Rate Analyzer</h6>
                </div>
                <div className="space-y-3 text-[11px] leading-relaxed text-[var(--text-muted)]">
                  <p>
                    Your current monthly burn rate is <span className="font-bold text-[var(--text-main)]">${analysis.monthlyBurnRate}</span>.
                  </p>
                  <p>
                    Based on your net balance of <span className="font-bold text-[var(--text-main)]">${analysis.balance.toFixed(2)}</span>, you can sustain operations for <span className="font-bold text-[var(--text-main)]">{analysis.runwayMonths} months</span> without any new capital injections.
                  </p>
                  <p>
                    A runway below <span className="text-[var(--color-warning)] font-semibold">3.0 months</span> calls for caution; a runway below <span className="text-[var(--color-danger)] font-semibold">1.0 month</span> requires emergency liquid asset buffer allocations.
                  </p>
                </div>
              </div>

              {/* Spike Warnings & Alerts */}
              <div className="card">
                <div className="border-b border-[var(--border-color)] pb-2.5 mb-4 flex items-center gap-2 text-[var(--text-main)]">
                  <LuTriangleAlert size={14} className="text-[var(--color-warning)]" />
                  <h6 className="text-xs font-bold uppercase">Spike Logs Warnings ({analysis.transactionSpikes.length})</h6>
                </div>
                <div className="max-h-[120px] overflow-y-auto space-y-1.5 scrollbar-thin">
                  {analysis.transactionSpikes.length > 0 ? (
                    analysis.transactionSpikes.map((spike, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 border border-[var(--border-color)] bg-[var(--bg-app)]/50 text-[10px] flex items-center justify-between"
                      >
                        <span className="truncate max-w-[150px]">
                          [{spike.date}] {spike.category || spike.source}
                        </span>
                        <span className="text-[var(--color-danger)] font-bold">
                          ${spike.amount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-[var(--text-muted)] italic py-6 text-center">
                      No volatile spike logs detected. System stable.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Print button footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={downloadReport}
                className="card-btn flex items-center gap-2 px-5 py-2 text-xs font-bold border hover:border-[var(--color-primary)] transition-all duration-150"
              >
                <LuDownload size={13} />
                <span>[ PRINT_SYSTEM_REPORT ]</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Diagnostics;
