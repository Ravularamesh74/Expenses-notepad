import api from "./api";

// 🔹 Normalize expense (optional safety layer)
const normalizeExpense = (e) => ({
  id: e._id || e.id,
  amount: Number(e.amount),
  category: e.category,
  note: e.note || "",
  date: e.date,
  userId: e.userId,
});

// 🔹 Build query string helper
const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "All") {
      query.append(key, value);
    }
  });

  return query.toString();
};

// ==========================================
// 📌 EXPENSE SERVICES
// ==========================================

// 🔥 Create Expense
export const createExpense = async (data) => {
  const res = await api.post("/expenses", data);
  return normalizeExpense(res.data || res);
};

// 🔥 Get Expenses (with filters + pagination)
export const getExpenses = async (filters = {}) => {
  const query = buildQuery(filters);

  const res = await api.get(`/expenses?${query}`);

  return (res.data || res).map(normalizeExpense);
};

// 🔥 Get Single Expense
export const getExpenseById = async (id) => {
  const res = await api.get(`/expenses/${id}`);
  return normalizeExpense(res.data || res);
};

// 🔥 Update Expense
export const updateExpense = async (id, data) => {
  const res = await api.put(`/expenses/${id}`, data);
  return normalizeExpense(res.data || res);
};

// 🔥 Delete Expense
export const deleteExpense = async (id) => {
  await api.delete(`/expenses/${id}`);
  return { success: true };
};

// ==========================================
// 📊 ANALYTICS SERVICES (ADVANCED)
// ==========================================

// 🔥 Get Expense Summary
export const getExpenseSummary = async (filters = {}) => {
  const query = buildQuery(filters);

  return await api.get(`/expenses/summary?${query}`);
};

// 🔥 Get Category Breakdown
export const getCategoryBreakdown = async (filters = {}) => {
  const query = buildQuery(filters);

  return await api.get(`/expenses/categories?${query}`);
};

// 🔥 Get Spending Trends
export const getSpendingTrends = async (filters = {}) => {
  const query = buildQuery(filters);

  return await api.get(`/expenses/trends?${query}`);
};