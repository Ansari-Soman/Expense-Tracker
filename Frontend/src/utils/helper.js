import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ").filter((w) => w.trim().length > 0);
  console.log("Words from getInitials == ", words);
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    if (words[i] && words[i][0]) {
      initials += words[i][0];
    }
  }
  return initials.toUpperCase();
};

export const addThousandsSeprator = (num) => {
  if (num == null || isNaN(num)) return "0";
  const parts = num.toString().split(".");
  parts[0] = Number(parts[0]).toLocaleString("en-US");
  return parts.join(".");
};

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }));
  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MM"),
    amount: item?.amount,
    source: item?.source,
  }));
  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const chartData = sortedData.map((item, index) => ({
    // month: moment(item?.date).format("Do MM"),
    // month: moment(item?.date).format("Do MMM HH:mm") + ` #${index + 1}`,
    month: moment(item?.date).format("Do MMM HH:mm") + ` #${index + 1}`,
    amount: item?.amount,
    category: item?.category,
  }));
  return chartData;
};
