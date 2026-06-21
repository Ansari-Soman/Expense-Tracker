import React from "react";
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import TransactionInfoCard from "../cards/TransactionInfoCard";
const RecentTransaction = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <h5 className="text-sm font-mono font-bold text-[var(--text-main)] uppercase tracking-wide">Recent Activity</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight />
        </button>
      </div>

      <div className="mt-6 flex flex-col">
        {transactions?.slice(0, 5)?.map((item) => (
          <TransactionInfoCard
            key={item._id}
            id={item._id}
            title={item.type === "expense" ? item.category : item.source}
            icon={item.icon}
            date={moment(item.date).format("MMM Do, YYYY")}
            amount={item.amount}
            type={item.type}
            description={item.description}
            paymentMethod={item.paymentMethod}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransaction;
