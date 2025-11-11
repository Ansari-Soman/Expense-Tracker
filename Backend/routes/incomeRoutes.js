const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  addIncome,
  getAllIncome,
  downlaodIncomeExcel,
  deleteIncome,
} = require("../controller/incomeController");

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/downloadExcel", protect, downlaodIncomeExcel);
router.delete("/:id", protect, deleteIncome);

module.exports = router;
