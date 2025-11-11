const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({ userId, icon, category, amount, date });
    await newExpense.save();
    res.status(200).json({ message: newExpense });
  } catch (err) {
    res.status(500).json({ message: "Server Error", Error: err });
  }
};

// Get all Expense
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const allExpense = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(allExpense);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Expense
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const allExpense = await Expense.find({ userId }).sort({ date: -1 });
    // Prepare data for Excel
    const data = allExpense.map((item) => ({
      Date: item.date,
      Amount: item.amount,
      Category: item.category,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
