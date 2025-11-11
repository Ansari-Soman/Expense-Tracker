const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controller/expenseController");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.delete("/:id", protect, deleteExpense);
router.get("/downloadExcel", protect, downloadExpenseExcel);

module.exports = router;
