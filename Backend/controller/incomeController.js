const xlsx = require("xlsx");
const Income = require("../models/Income");

// Add Income Source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: Date(date),
    });
    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all income sourve
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const allIncome = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json(allIncome);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income source
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Excel
exports.downlaodIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const allIncome = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = allIncome.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    console.log("Data == ", data);

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (err) {
    res.status(500).json({ message: "Server Error", Error: err });
  }
};
