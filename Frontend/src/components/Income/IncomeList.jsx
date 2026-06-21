import React, { useState, useMemo, useEffect } from "react";
import { LuDownload, LuSearch, LuArrowUpDown, LuFilter, LuLayoutGrid, LuList, LuChevronLeft, LuChevronRight, LuTrash2, LuCalendar } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import CategoryIcon, { ICON_MAP } from "../CategoryIcon";
import moment from "moment";

const IncomeList = ({ onDownload, onDelete, transactions = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "list"

  const renderTransactionIcon = (icon, source) => {
    const iconLower = icon?.toLowerCase();
    const sourceLower = source?.toLowerCase();
    
    if (icon && ICON_MAP[iconLower]) {
      return <CategoryIcon iconName={icon} className="text-base" />;
    }
    if (source && ICON_MAP[sourceLower]) {
      return <CategoryIcon iconName={source} className="text-base" />;
    }
    if (icon && icon.trim().length > 0) {
      return <span className="text-sm select-none">{icon}</span>;
    }
    return <span className="text-sm select-none">$</span>;
  };
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get unique sources for the filter dropdown
  const uniqueSources = useMemo(() => {
    const set = new Set();
    transactions.forEach((tx) => {
      if (tx.source) set.add(tx.source);
    });
    return ["all", ...Array.from(set)];
  }, [transactions]);

  // Apply search, filter, and sorting
  const processedTransactions = useMemo(() => {
    let result = [...transactions];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.source?.toLowerCase().includes(q) ||
          tx.amount?.toString().includes(q)
      );
    }

    // 2. Source Filter
    if (sourceFilter !== "all") {
      result = result.filter(
        (tx) => tx.source?.toLowerCase() === sourceFilter.toLowerCase()
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === "date-asc") {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === "amount-desc") {
        return b.amount - a.amount;
      }
      if (sortBy === "amount-asc") {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [transactions, searchQuery, sortBy, sourceFilter]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sourceFilter, sortBy]);

  // Compute total pages
  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);

  // Paginated sliced transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [processedTransactions, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="card">
      {/* Header controls block */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 mb-5 border-b border-[var(--border-color)]">
        <div>
          <h5 className="text-base font-bold text-[var(--text-main)] tracking-tight">
            Income Ledger ({processedTransactions.length} items)
          </h5>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
            Monitor and audit all incoming revenue streams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Layout switch controls */}
          <div className="flex bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl p-0.5">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                viewMode === "cards"
                  ? "bg-white dark:bg-slate-800 text-[var(--color-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
              title="Cards grid view"
            >
              <LuLayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-800 text-[var(--color-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
              title="Row list view"
            >
              <LuList size={15} />
            </button>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[var(--bg-app)]/50 border border-[var(--border-color)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-main)]">
            <LuSearch className="text-[var(--text-muted)]" size={13} />
            <input
              type="text"
              placeholder="Search source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-28 sm:w-36 placeholder-[var(--text-muted)]"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-app)]/50 border border-[var(--border-color)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-main)]">
            <LuFilter className="text-[var(--text-muted)]" size={13} />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-xs cursor-pointer capitalize font-semibold"
            >
              <option value="all">All Sources</option>
              {uniqueSources.filter(s => s !== "all").map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-app)]/50 border border-[var(--border-color)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-main)]">
            <LuArrowUpDown className="text-[var(--text-muted)]" size={13} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none text-xs cursor-pointer font-semibold"
            >
              <option value="date-desc">Newest Date</option>
              <option value="date-asc">Oldest Date</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>

          {/* Download Button */}
          <button className="card-btn" onClick={onDownload} title="Export spreadsheet">
            <LuDownload size={13} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Main List Rendering */}
      {paginatedTransactions.length > 0 ? (
        <>
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 gap-1">
              {paginatedTransactions.map((income) => (
                <TransactionInfoCard
                  key={income._id}
                  id={income._id}
                  title={income.source}
                  icon={income.icon}
                  date={moment(income.date).format("MMM Do, YYYY")}
                  amount={income.amount}
                  type="income"
                  description={income.description}
                  paymentMethod={income.paymentMethod}
                  onDelete={() => onDelete(income._id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {paginatedTransactions.map((income) => (
                <div key={income._id} className="list-row-item group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-success-light)] text-[var(--color-success)] flex items-center justify-center flex-shrink-0">
                      {renderTransactionIcon(income.icon, income.source)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-[var(--text-main)] capitalize truncate">{income.source}</div>
                      <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                        <LuCalendar size={11} />
                        {moment(income.date).format("MMM Do, YYYY")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[var(--color-success)]">
                      +${income.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => onDelete(income._id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center border border-[var(--border-color)] hover:border-[var(--color-danger)] text-[var(--text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] cursor-pointer transition-colors duration-150"
                    >
                      <LuTrash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Showing page <span className="font-semibold text-[var(--text-main)]">{currentPage}</span> of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="pagination-btn flex items-center gap-1"
                >
                  <LuChevronLeft size={14} />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`pagination-number-btn ${
                        currentPage === pageNumber ? "pagination-number-btn-active" : "hover:bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-btn flex items-center gap-1"
                >
                  <span>Next</span>
                  <LuChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--bg-app)]/30">
          <p className="text-sm text-[var(--text-muted)] font-semibold">No records found</p>
          <span className="text-xs text-[var(--text-muted)] mt-1">
            No income entries match the active search filters.
          </span>
        </div>
      )}
    </div>
  );
};

export default IncomeList;
