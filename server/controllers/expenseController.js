import Expense from "../models/Expense.js";

// ==========================================
// ➕ CREATE EXPENSE
// ==========================================
export const createExpense = async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ message: "Amount & category required" });
    }

    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      category,
      note,
      date,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 📥 GET ALL EXPENSES (FILTER SUPPORT)
// ==========================================
export const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    const query = { userId: req.user.id };

    if (category && category !== "All") {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};

      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// ✏️ UPDATE EXPENSE
// ==========================================
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// ❌ DELETE EXPENSE
// ==========================================
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 📊 SUMMARY (TOTAL, COUNT)
// ==========================================
export const getSummary = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          avg: { $avg: "$amount" },
        },
      },
    ]);

    res.json(result[0] || { total: 0, count: 0, avg: 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 📊 CATEGORY BREAKDOWN
// ==========================================
export const getCategoryBreakdown = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(
      data.map((d) => ({
        category: d._id,
        total: d.total,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 📈 SPENDING TRENDS (BY DATE)
// ==========================================
export const getTrends = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      data.map((d) => ({
        date: d._id,
        total: d.total,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};