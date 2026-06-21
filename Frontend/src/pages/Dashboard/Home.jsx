import React, { useEffect, useState, useMemo, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/userAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import InfoCard from "../../components/cards/InfoCard";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeprator } from "../../utils/helper";
import RecentTransaction from "../../components/Dashboard/RecentTransaction";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import ContributionCalendar from "../../components/Dashboard/ContributionCalendar";
import BudgetTargets from "../../components/Dashboard/BudgetTargets";

import { UserContext } from "../../context/UserContext";
import { MOCK_INCOMES, MOCK_EXPENSES } from "../../utils/mockData";
import ConsoleLoader from "../../components/ConsoleLoader";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const { demoDataEnabled } = useContext(UserContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.log("Something went wrong. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute realistic mock dashboard data on the fly
  const mockDashboardData = useMemo(() => {
    const totalIncome = MOCK_INCOMES.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = MOCK_EXPENSES.reduce((sum, item) => sum + item.amount, 0);
    const totalBalance = totalIncome - totalExpense;

    const recentTransaction = [
      ...MOCK_INCOMES.map((t) => ({ ...t, type: "income" })),
      ...MOCK_EXPENSES.map((t) => ({ ...t, type: "expense" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      recentTransaction,
      last30DaysExpenses: { transactions: MOCK_EXPENSES },
      last60DaysIncome: { transactions: MOCK_INCOMES },
    };
  }, []);

  // Use mock data if sandbox mode is active or if user account has zero database records
  const isDatabaseEmpty = !dashboardData || (dashboardData.totalIncome === 0 && dashboardData.totalExpense === 0);
  const activeDashboardData = (demoDataEnabled || (!loading && isDatabaseEmpty)) ? mockDashboardData : dashboardData;

  const allTransactions = useMemo(() => {
    if (!activeDashboardData) return [];
    const map = new Map();

    const incs = (activeDashboardData.last60DaysIncome?.transactions || []).map((t) => ({
      ...t,
      type: "income",
      source: t.source || t.category,
    }));

    const exps = (activeDashboardData.last30DaysExpenses?.transactions || []).map((t) => ({
      ...t,
      type: "expense",
    }));

    const recs = (activeDashboardData.recentTransaction || []).map((t) => ({
      ...t,
      type: t.type || (t.source ? "income" : "expense"),
    }));

    [...incs, ...exps, ...recs].forEach((t) => {
      if (t._id) map.set(t._id, t);
    });

    return Array.from(map.values());
  }, [activeDashboardData]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        {loading ? (
          <ConsoleLoader message="RETRIEVING_DATA_STREAM" />
        ) : (
          <>
            {demoDataEnabled && (
              <div className="mb-4 p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] font-mono text-[10px] rounded border border-[var(--color-primary)]/20 flex items-center justify-between">
                <span>$ sandbox_status --mode sandbox_simulation_active</span>
                <span>[SIMULATING DATA]</span>
              </div>
            )}

            {/* Console switcher tabs */}
            <div className="flex border-b border-[var(--border-color)] mb-6 gap-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 font-mono text-xs font-bold border-t border-x transition-all duration-150 cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[var(--bg-card)] text-[var(--color-primary)]"
                    : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
                style={{
                  borderColor:
                    activeTab === "overview"
                      ? "var(--border-color) var(--border-color) var(--bg-card) var(--border-color)"
                      : "transparent transparent var(--border-color) transparent",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  marginBottom: activeTab === "overview" ? "-1px" : "0",
                }}
              >
                [ OVERVIEW ]
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 font-mono text-xs font-bold border-t border-x transition-all duration-150 cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-[var(--bg-card)] text-[var(--color-primary)]"
                    : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
                style={{
                  borderColor:
                    activeTab === "analytics"
                      ? "var(--border-color) var(--border-color) var(--bg-card) var(--border-color)"
                      : "transparent transparent var(--border-color) transparent",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  marginBottom: activeTab === "analytics" ? "-1px" : "0",
                }}
              >
                [ ANALYTICS ]
              </button>
              <button
                onClick={() => setActiveTab("ledgers")}
                className={`px-4 py-2 font-mono text-xs font-bold border-t border-x transition-all duration-150 cursor-pointer ${
                  activeTab === "ledgers"
                    ? "bg-[var(--bg-card)] text-[var(--color-primary)]"
                    : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
                style={{
                  borderColor:
                    activeTab === "ledgers"
                      ? "var(--border-color) var(--border-color) var(--bg-card) var(--border-color)"
                      : "transparent transparent var(--border-color) transparent",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  marginBottom: activeTab === "ledgers" ? "-1px" : "0",
                }}
              >
                [ LEDGERS ]
              </button>
            </div>

            {/* Tab content panels */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoCard
                    icon={<IoMdCard />}
                    label="Total Balance"
                    value={addThousandsSeprator(activeDashboardData?.totalBalance || 0)}
                    color="bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  />

                  <InfoCard
                    icon={<LuWalletMinimal />}
                    label="Total Income"
                    value={addThousandsSeprator(activeDashboardData?.totalIncome || 0)}
                    color="bg-[var(--color-success-light)] text-[var(--color-success)]"
                  />

                  <InfoCard
                    icon={<LuHandCoins />}
                    label="Total Expense"
                    value={addThousandsSeprator(activeDashboardData?.totalExpense || 0)}
                    color="bg-[var(--color-danger-light)] text-[var(--color-danger)]"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <div className="lg:col-span-2 space-y-6">
                    <ContributionCalendar transactions={allTransactions} />
                    <RecentTransaction
                      transactions={activeDashboardData?.recentTransaction}
                      onSeeMore={() => navigate("/expense")}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <BudgetTargets transactions={allTransactions} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.2s_ease-out]">
                <FinanceOverview
                  totalBalance={activeDashboardData?.totalBalance || 0}
                  totalIncome={activeDashboardData?.totalIncome || 0}
                  totalExpense={activeDashboardData?.totalExpense || 0}
                />

                <Last30DaysExpenses
                  data={activeDashboardData?.last30DaysExpenses?.transactions || []}
                />

                <div className="md:col-span-2">
                  <RecentIncomeWithChart
                    data={
                      activeDashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []
                    }
                    totalIncome={activeDashboardData?.totalIncome || 0}
                  />
                </div>
              </div>
            )}

            {activeTab === "ledgers" && (
              <div className="grid grid-cols-1 gap-6 animate-[fadeIn_0.2s_ease-out]">
                <ExpenseTransactions
                  transactions={activeDashboardData?.last30DaysExpenses?.transactions || []}
                  onSeeMore={() => navigate("/expense")}
                />

                <RecentIncome
                  transactions={activeDashboardData?.last60DaysIncome?.transactions || []}
                  onSeeMore={() => navigate("/income")}
                />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
