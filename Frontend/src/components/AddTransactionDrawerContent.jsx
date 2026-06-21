import React, { useState } from "react";
import IconPicker from "./Inputs/IconPicker";
import Input from "./Inputs/Input";
import CategoryIcon, { ICON_MAP } from "./CategoryIcon";
import { LuPlus, LuTrash2, LuSave } from "react-icons/lu";
import toast from "react-hot-toast";

const AddTransactionDrawerContent = ({ type = "income", onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState("single");

  // Single insert state
  const [singleData, setSingleData] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: type === "income" ? "salary" : "food",
    description: "",
    paymentMethod: "Cash",
  });

  // Bulk insert state
  const [bulkRows, setBulkRows] = useState([
    {
      id: 1,
      title: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      icon: type === "income" ? "salary" : "food",
      description: "",
      paymentMethod: "Cash",
    },
  ]);

  // Keyword-to-icon mapping for auto-suggestion
  const suggestIconFromTitle = (titleText) => {
    const text = titleText.toLowerCase();
    
    // Income keywords
    if (text.includes("salary") || text.includes("wage") || text.includes("paycheck") || text.includes("job")) return "salary";
    if (text.includes("freelance") || text.includes("contract") || text.includes("client") || text.includes("project")) return "freelance";
    if (text.includes("invest") || text.includes("stock") || text.includes("dividend") || text.includes("profit")) return "investment";
    if (text.includes("gift") || text.includes("bonus") || text.includes("award")) return "gift";

    // Expense keywords
    if (text.includes("food") || text.includes("eat") || text.includes("grocer") || text.includes("restaurant") || text.includes("lunch") || text.includes("coffee") || text.includes("starbucks")) return "food";
    if (text.includes("rent") || text.includes("room") || text.includes("apartment") || text.includes("housing")) return "rent";
    if (text.includes("electric") || text.includes("gas") || text.includes("water") || text.includes("internet") || text.includes("wifi") || text.includes("bill")) return "utilities";
    if (text.includes("taxi") || text.includes("uber") || text.includes("lyft") || text.includes("car") || text.includes("transport") || text.includes("fuel") || text.includes("gasoline") || text.includes("metro") || text.includes("bus")) return "transport";
    if (text.includes("shop") || text.includes("clothes") || text.includes("amazon") || text.includes("store")) return "shopping";
    if (text.includes("game") || text.includes("movie") || text.includes("netflix") || text.includes("play") || text.includes("leisure") || text.includes("party")) return "entertainment";
    if (text.includes("health") || text.includes("doctor") || text.includes("medicine") || text.includes("pharmacy") || text.includes("hospital") || text.includes("clinic") || text.includes("gym")) return "health";
    
    return "other";
  };

  const handleSingleTitleChange = (val) => {
    const suggested = suggestIconFromTitle(val);
    setSingleData((prev) => ({
      ...prev,
      title: val,
      icon: suggested !== "other" ? suggested : prev.icon,
    }));
  };

  const handleBulkTitleChange = (id, val) => {
    const suggested = suggestIconFromTitle(val);
    setBulkRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            title: val,
            icon: suggested !== "other" ? suggested : row.icon,
          };
        }
        return row;
      })
    );
  };

  const handleBulkFieldChange = (id, field, val) => {
    setBulkRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  const addBulkRow = () => {
    const nextId = bulkRows.length > 0 ? Math.max(...bulkRows.map((r) => r.id)) + 1 : 1;
    setBulkRows((prev) => [
      ...prev,
      {
        id: nextId,
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        icon: type === "income" ? "salary" : "food",
        description: "",
        paymentMethod: "Cash",
      },
    ]);
  };

  const removeBulkRow = (id) => {
    if (bulkRows.length === 1) {
      toast.error("You must have at least one transaction row.");
      return;
    }
    setBulkRows((prev) => prev.filter((r) => r.id !== id));
  };

  const submitSingle = () => {
    const { title, amount, date, icon, description, paymentMethod } = singleData;
    if (!title.trim()) {
      toast.error(`${type === "income" ? "Source" : "Category"} is required`);
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }
    if (!date) {
      toast.error("Date is required");
      return;
    }

    const payload =
      type === "income"
        ? { source: title, amount: Number(amount), date, icon, description, paymentMethod }
        : { category: title, amount: Number(amount), date, icon, description, paymentMethod };

    onSave(payload);
  };

  const submitBulk = () => {
    // Validate all rows
    for (let i = 0; i < bulkRows.length; i++) {
      const row = bulkRows[i];
      if (!row.title.trim()) {
        toast.error(`Row ${i + 1}: Title is required.`);
        return;
      }
      if (!row.amount || isNaN(row.amount) || Number(row.amount) <= 0) {
        toast.error(`Row ${i + 1}: Amount must be a positive number.`);
        return;
      }
      if (!row.date) {
        toast.error(`Row ${i + 1}: Date is required.`);
        return;
      }
    }

    const payloads = bulkRows.map((row) => {
      return type === "income"
        ? { source: row.title, amount: Number(row.amount), date: row.date, icon: row.icon, description: row.description, paymentMethod: row.paymentMethod }
        : { category: row.title, amount: Number(row.amount), date: row.date, icon: row.icon, description: row.description, paymentMethod: row.paymentMethod };
    });

    onSave(payloads);
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs text-[var(--text-main)]">
      {/* Switch Tabs */}
      <div className="flex border-b border-[var(--border-color)] mb-5 bg-[var(--bg-app)]/30 rounded p-1">
        <button
          onClick={() => setActiveTab("single")}
          className={`flex-1 py-1.5 text-center font-bold rounded transition-all duration-150 cursor-pointer ${
            activeTab === "single"
              ? "bg-[var(--bg-card)] text-[var(--color-primary)] border border-[var(--border-color)] shadow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
          }`}
        >
          SINGLE_ENTRY
        </button>
        <button
          onClick={() => setActiveTab("bulk")}
          className={`flex-1 py-1.5 text-center font-bold rounded transition-all duration-150 cursor-pointer ${
            activeTab === "bulk"
              ? "bg-[var(--bg-card)] text-[var(--color-primary)] border border-[var(--border-color)] shadow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
          }`}
        >
          BULK_MULTIPLE
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto mb-4 pr-1">
        {activeTab === "single" ? (
          <div className="space-y-4">
            <IconPicker
              value={singleData.icon}
              onSelect={(ico) => setSingleData((prev) => ({ ...prev, icon: ico }))}
            />

            <Input
              value={singleData.title}
              onChange={({ target }) => handleSingleTitleChange(target.value)}
              label={type === "income" ? "Income Source" : "Category"}
              placeholder={type === "income" ? "Salary, Freelance..." : "Rent, Groceries..."}
              type="text"
            />

            <Input
              value={singleData.amount}
              onChange={({ target }) => setSingleData((prev) => ({ ...prev, amount: target.value }))}
              label="Amount ($)"
              placeholder="0.00"
              type="number"
            />

            <Input
              value={singleData.date}
              onChange={({ target }) => setSingleData((prev) => ({ ...prev, date: target.value }))}
              label="Date"
              type="date"
            />

            {/* Additional custom fields */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setSingleData((prev) => ({ ...prev, paymentMethod: "Cash" }))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 border text-[11px] font-bold font-mono transition-all duration-150 cursor-pointer ${
                    singleData.paymentMethod === "Cash"
                      ? "bg-[var(--bg-card)] border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm"
                      : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                  <span>Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSingleData((prev) => ({ ...prev, paymentMethod: "Card" }))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 border text-[11px] font-bold font-mono transition-all duration-150 cursor-pointer ${
                    singleData.paymentMethod === "Card"
                      ? "bg-[var(--bg-card)] border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm"
                      : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSingleData((prev) => ({ ...prev, paymentMethod: "Transfer" }))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 border text-[11px] font-bold font-mono transition-all duration-150 cursor-pointer ${
                    singleData.paymentMethod === "Transfer"
                      ? "bg-[var(--bg-card)] border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm"
                      : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 1l4 4-4 4" />
                    <path d="M3 5h18" />
                    <path d="M7 23l-4-4 4-4" />
                    <path d="M21 19H3" />
                  </svg>
                  <span>Transfer</span>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Description / Memo Notes
              </label>
              <textarea
                value={singleData.description}
                onChange={(e) => setSingleData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional details or description notes about this transaction..."
                rows={3}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] outline-none px-3 py-2.5 font-mono text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:shadow-[0_0_8px_rgba(0,229,255,0.2)] transition-all duration-150"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed pb-2 border-b border-[var(--border-color)]">
              Input multiple records below. Icons auto-update based on your title keywords.
            </p>

            {bulkRows.map((row, idx) => (
              <div
                key={row.id}
                className="p-3 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-md flex flex-col gap-2 relative group"
              >
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase bg-[var(--bg-card)] border border-[var(--border-color)] px-1 rounded">
                    Row #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBulkRow(row.id)}
                    className="text-[var(--text-muted)] hover:text-[var(--color-danger)] p-1 cursor-pointer"
                    title="Remove row"
                  >
                    <LuTrash2 size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 rounded border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-center text-sm flex-shrink-0">
                    <CategoryIcon iconName={row.icon} className="text-sm" />
                  </div>
                  <div className="grow">
                    <input
                      type="text"
                      placeholder={type === "income" ? "Freelance..." : "Groceries..."}
                      value={row.title}
                      onChange={(e) => handleBulkTitleChange(row.id, e.target.value)}
                      className="w-full bg-transparent border-0 outline-none text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1 pt-1.5 border-t border-[var(--border-color)]/50">
                  <div>
                    <label className="block text-[8px] text-[var(--text-muted)] uppercase font-bold mb-0.5">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={row.amount}
                      onChange={(e) => handleBulkFieldChange(row.id, "amount", e.target.value)}
                      className="w-full bg-transparent border-b border-[var(--border-color)] focus:border-[var(--color-primary)] outline-none text-xs text-[var(--text-main)] py-0.5 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-[var(--text-muted)] uppercase font-bold mb-0.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => handleBulkFieldChange(row.id, "date", e.target.value)}
                      className="w-full bg-transparent border-b border-[var(--border-color)] focus:border-[var(--color-primary)] outline-none text-xs text-[var(--text-main)] py-0.5"
                    />
                  </div>
                </div>

                {/* Additional bulk inputs */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <label className="block text-[8px] text-[var(--text-muted)] uppercase font-bold mb-0.5">
                      Method
                    </label>
                    <select
                      value={row.paymentMethod}
                      onChange={(e) => handleBulkFieldChange(row.id, "paymentMethod", e.target.value)}
                      className="w-full bg-transparent border-b border-[var(--border-color)] focus:border-[var(--color-primary)] outline-none text-[10px] text-[var(--text-main)] py-0.5"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Transfer">Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] text-[var(--text-muted)] uppercase font-bold mb-0.5">
                      Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Notes memo..."
                      value={row.description}
                      onChange={(e) => handleBulkFieldChange(row.id, "description", e.target.value)}
                      className="w-full bg-transparent border-b border-[var(--border-color)] focus:border-[var(--color-primary)] outline-none text-[10px] text-[var(--text-main)] py-0.5"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addBulkRow}
              className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-[var(--text-main)] hover:text-[var(--color-primary)] bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-primary)] rounded-md py-2 transition-all duration-150 cursor-pointer"
            >
              <LuPlus size={12} />
              <span>ADD_TRANSACTION_ROW</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[var(--border-color)] flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 text-center border border-[var(--border-color)] rounded-md hover:bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all duration-150 cursor-pointer font-bold uppercase"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={activeTab === "single" ? submitSingle : submitBulk}
          className="flex-1 py-2 text-center bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] border border-[var(--border-color)] rounded-md shadow-sm transition-all duration-150 cursor-pointer font-bold flex items-center justify-center gap-1.5 uppercase"
        >
          <LuSave size={13} />
          <span>Save Logs</span>
        </button>
      </div>
    </div>
  );
};

export default AddTransactionDrawerContent;
