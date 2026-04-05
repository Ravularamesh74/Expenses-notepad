import express from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
  getCategoryBreakdown,
  getTrends,
} from "../controllers/expenseController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// 🔐 APPLY AUTH MIDDLEWARE TO ALL ROUTES
// ==========================================
router.use(protect);

// ==========================================
// 💸 CRUD ROUTES
// ==========================================

// ➕ Create Expense
router.post("/", createExpense);

// 📥 Get All Expenses (with filters)
router.get("/", getExpenses);

// ✏️ Update Expense
router.put("/:id", updateExpense);

// ❌ Delete Expense
router.delete("/:id", deleteExpense);

// ==========================================
// 📊 ANALYTICS ROUTES
// ==========================================

// 📊 Summary (total, avg, count)
router.get("/summary", getSummary);

// 📊 Category breakdown
router.get("/categories", getCategoryBreakdown);

// 📈 Trends (time series)
router.get("/trends", getTrends);

// ==========================================
// 🔐 ADMIN ROUTES (OPTIONAL)
// ==========================================

router.get(
  "/admin/all",
  authorize("admin"),
  async (req, res) => {
    res.json({ message: "Admin can view all expenses (extend this)" });
  }
);

export default router;