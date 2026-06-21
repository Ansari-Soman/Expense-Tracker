import moment from "moment";

const d = (daysAgo) => {
  return moment().subtract(daysAgo, "days").toISOString();
};

export const MOCK_INCOMES = [
  { _id: "mock-inc-1", source: "Primary Salary", amount: 4800, date: d(1), icon: "salary" },
  { _id: "mock-inc-2", source: "Venture Dividend", amount: 350, date: d(3), icon: "investment" },
  { _id: "mock-inc-3", source: "Consulting Project", amount: 1500, date: d(7), icon: "freelance" },
  { _id: "mock-inc-4", source: "Primary Salary", amount: 4800, date: d(31), icon: "salary" },
  { _id: "mock-inc-5", source: "Mobile App Contract", amount: 2200, date: d(14), icon: "freelance" },
  { _id: "mock-inc-6", source: "Birthday Gift", amount: 150, date: d(20), icon: "gift" },
  { _id: "mock-inc-7", source: "Consulting Project", amount: 1200, date: d(24), icon: "freelance" },
  { _id: "mock-inc-8", source: "Primary Salary", amount: 4800, date: d(60), icon: "salary" },
  { _id: "mock-inc-9", source: "SaaS Subscription Sale", amount: 99, date: d(12), icon: "freelance" },
  { _id: "mock-inc-10", source: "SaaS Subscription Sale", amount: 199, date: d(2), icon: "freelance" },
  { _id: "mock-inc-11", source: "Venture Dividend", amount: 420, date: d(33), icon: "investment" },
  { _id: "mock-inc-12", source: "Consulting Project", amount: 950, date: d(45), icon: "freelance" },
  { _id: "mock-inc-13", source: "eBay Store Sales", amount: 310, date: d(18), icon: "freelance" },
  { _id: "mock-inc-14", source: "Cashback Reward", amount: 45, date: d(29), icon: "gift" },
];

export const MOCK_EXPENSES = [
  { _id: "mock-exp-1", category: "Appartement Rent", amount: 1200, date: d(2), icon: "rent" },
  { _id: "mock-exp-2", category: "Whole Foods Grocery", amount: 142, date: d(1), icon: "food" },
  { _id: "mock-exp-3", category: "Uber Commute", amount: 24, date: d(1), icon: "transport" },
  { _id: "mock-exp-4", category: "AWS Cloud Platform", amount: 84, date: d(3), icon: "utilities" },
  { _id: "mock-exp-5", category: "Netflix Premium", amount: 22, date: d(5), icon: "entertainment" },
  { _id: "mock-exp-6", category: "Starbucks Coffee", amount: 7.5, date: d(2), icon: "food" },
  { _id: "mock-exp-7", category: "Gas Station Refill", amount: 55, date: d(4), icon: "transport" },
  { _id: "mock-exp-8", category: "Nike Shoes", amount: 120, date: d(6), icon: "shopping" },
  { _id: "mock-exp-9", category: "Medical Prescription", amount: 35, date: d(8), icon: "health" },
  { _id: "mock-exp-10", category: "Local Diner Lunch", amount: 18.5, date: d(9), icon: "food" },
  { _id: "mock-exp-11", category: "Electricity Bill", amount: 110, date: d(10), icon: "utilities" },
  { _id: "mock-exp-12", category: "Gym Membership", amount: 60, date: d(12), icon: "health" },
  { _id: "mock-exp-13", category: "Cinemark Tickets", amount: 32, date: d(13), icon: "entertainment" },
  { _id: "mock-exp-14", category: "Appartement Rent", amount: 1200, date: d(32), icon: "rent" },
  { _id: "mock-exp-15", category: "AWS Cloud Platform", amount: 82, date: d(33), icon: "utilities" },
  { _id: "mock-exp-16", category: "Whole Foods Grocery", amount: 168, date: d(14), icon: "food" },
  { _id: "mock-exp-17", category: "GitHub Copilot", amount: 10, date: d(15), icon: "utilities" },
  { _id: "mock-exp-18", category: "Steam Game Sale", amount: 45, date: d(16), icon: "entertainment" },
  { _id: "mock-exp-19", category: "Uber Commute", amount: 29, date: d(18), icon: "transport" },
  { _id: "mock-exp-20", category: "Haircut", amount: 40, date: d(20), icon: "health" },
  { _id: "mock-exp-21", category: "Internet Fiber subscription", amount: 70, date: d(22), icon: "utilities" },
  { _id: "mock-exp-22", category: "Gas Station Refill", amount: 62, date: d(25), icon: "transport" },
  { _id: "mock-exp-23", category: "Restaurant Dinner", amount: 95, date: d(27), icon: "food" },
  { _id: "mock-exp-24", category: "Keyboard Keycaps", amount: 89, date: d(29), icon: "shopping" },
  { _id: "mock-exp-25", category: "Whole Foods Grocery", amount: 115, date: d(21), icon: "food" },
  { _id: "mock-exp-26", category: "Appartement Rent", amount: 1200, date: d(62), icon: "rent" },
];
