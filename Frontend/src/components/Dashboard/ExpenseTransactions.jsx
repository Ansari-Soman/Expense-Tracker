import React from "react";
import { LuAArrowDown, LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import moment from "moment";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h5 className="text-sm font-mono font-bold text-[var(--text-main)] uppercase tracking-wide">Expense Logs</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6 flex flex-col">
        {transactions?.slice(0, 5)?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            id={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={moment(expense.date).format("MMM Do, YYYY")}
            amount={expense.amount}
            type="expense"
            description={expense.description}
            paymentMethod={expense.paymentMethod}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
