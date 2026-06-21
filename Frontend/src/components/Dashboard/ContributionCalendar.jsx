import React, { useMemo, useState } from "react";
import moment from "moment";
import { LuInfo, LuCalendar } from "react-icons/lu";

const ContributionCalendar = ({ transactions = [] }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  // Group transactions by YYYY-MM-DD
  const dailyData = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      if (!tx.date) return;
      const dateStr = moment(tx.date).format("YYYY-MM-DD");
      if (!map[dateStr]) {
        map[dateStr] = {
          count: 0,
          totalAmount: 0,
          items: [],
        };
      }
      map[dateStr].count += 1;
      map[dateStr].totalAmount += tx.amount || 0;
      map[dateStr].items.push(tx);
    });
    return map;
  }, [transactions]);

  // Generate list of past 365 days, aligned to start on a Sunday
  const calendarGrid = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 365);

    // Align start date to Sunday
    const startDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDayOfWeek);

    const grid = [];
    let current = new Date(startDate);
    
    // Create columns (weeks)
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = moment(current).format("YYYY-MM-DD");
        const dayData = dailyData[dateStr] || { count: 0, totalAmount: 0, items: [] };
        
        week.push({
          date: new Date(current),
          dateStr,
          ...dayData,
        });

        // Advance 1 day
        current.setDate(current.getDate() + 1);
      }
      grid.push(week);
    }
    return grid;
  }, [dailyData]);

  // Determine heatmap cell colors based on volume of transactions
  const getCellColorClass = (count, totalAmount) => {
    if (count === 0) {
      return "bg-[var(--bg-app)] hover:ring-1 hover:ring-[var(--border-color)]";
    }
    
    // Scale color by transaction volume
    if (totalAmount < 100) return "bg-emerald-500/20 text-emerald-100 hover:scale-110";
    if (totalAmount < 500) return "bg-emerald-500/40 text-emerald-200 hover:scale-110";
    if (totalAmount < 1500) return "bg-emerald-500/75 text-emerald-400 hover:scale-110";
    return "bg-emerald-500 text-white hover:scale-110";
  };

  const weekdays = ["Sun", "", "Tue", "", "Thu", "", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="card w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="text-sm font-mono font-bold text-[var(--text-main)] flex items-center gap-2">
            <LuCalendar className="text-[var(--color-primary)]" />
            TRANSACTION_COMMITS_CALENDAR
          </h5>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
            Heat map of deposit and check activity over the past 365 days.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] text-[var(--text-muted)] font-mono">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded bg-[var(--bg-app)] border border-[var(--border-color)]"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/20"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/40"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/75"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-2 items-start overflow-x-auto pb-2 select-none">
        {/* Weekday Labels */}
        <div className="grid grid-rows-7 gap-[3px] text-[8px] font-mono text-[var(--text-muted)] mt-4 pr-1">
          {weekdays.map((day, i) => (
            <div key={i} className="h-2.5 flex items-center justify-end w-6">
              {day}
            </div>
          ))}
        </div>

        {/* The Grid */}
        <div className="flex flex-col gap-1">
          {/* Months label row */}
          <div className="flex text-[9px] font-mono text-[var(--text-muted)] h-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-[32px] sm:w-[42px] truncate">
                {months[i]}
              </div>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {calendarGrid.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-[3px]">
                {week.map((day, dayIndex) => {
                  const colorClass = getCellColorClass(day.count, day.totalAmount);
                  return (
                    <div
                      key={dayIndex}
                      onClick={() => {
                        if (day.count > 0) {
                          setSelectedDay(day);
                        } else {
                          setSelectedDay(null);
                        }
                      }}
                      className={`w-2.5 h-2.5 sm:w-[11px] sm:h-[11px] rounded-[1.5px] cursor-pointer transition-all duration-100 ${colorClass}`}
                      title={`${moment(day.date).format("MMM Do, YYYY")}: ${day.count} transaction(s) ($${day.totalAmount.toFixed(2)})`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected day detail overlay panel (ServiceNow UI element) */}
      {selectedDay && (
        <div className="mt-4 p-3 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-md animate-fadeIn">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-1.5 mb-2">
            <span className="text-[10px] font-bold text-[var(--text-main)] font-mono">
              COMMITS ON {selectedDay.dateStr}
            </span>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-[9px] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
            >
              [Close]
            </button>
          </div>
          
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
            {selectedDay.items.map((tx, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`w-1.5 h-1.5 rounded-full ${tx.type === "income" ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"}`}></span>
                  <span className="text-[var(--text-main)] truncate">{tx.source || tx.category}</span>
                </div>
                <span className={tx.type === "income" ? "text-[var(--color-success)] font-semibold" : "text-[var(--color-danger)]"}>
                  {tx.type === "income" ? "+" : "-"} ${tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionCalendar;
