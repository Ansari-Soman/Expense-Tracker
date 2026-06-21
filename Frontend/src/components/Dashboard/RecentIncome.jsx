import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import moment from "moment";

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h5 className="text-sm font-mono font-bold text-[var(--text-main)] uppercase tracking-wide">Income Logs</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6 flex flex-col">
        {transactions?.slice(0, 5)?.map((item) => (
          <TransactionInfoCard
            key={item._id}
            id={item._id}
            title={item.source}
            icon={item.icon}
            date={moment(item.date).format("MMM Do, YYYY")}
            amount={item.amount}
            type="income"
            description={item.description}
            paymentMethod={item.paymentMethod}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentIncome;
