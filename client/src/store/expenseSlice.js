import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as expenseService from "../services/expenseService";

// ==========================================
// 🔥 ASYNC THUNKS
// ==========================================

// 📥 Fetch Expenses
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (filters = {}, thunkAPI) => {
    try {
      return await expenseService.getExpenses(filters);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ➕ Create Expense
export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (data, thunkAPI) => {
    try {
      return await expenseService.createExpense(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✏️ Update Expense
export const editExpense = createAsyncThunk(
  "expenses/editExpense",
  async ({ id, data }, thunkAPI) => {
    try {
      return await expenseService.updateExpense(id, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ❌ Delete Expense
export const removeExpense = createAsyncThunk(
  "expenses/removeExpense",
  async (id, thunkAPI) => {
    try {
      await expenseService.deleteExpense(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ==========================================
// 🧱 INITIAL STATE
// ==========================================

const initialState = {
  items: [],
  loading: false,
  error: null,

  // 🔥 Advanced state
  filters: {
    category: "All",
    startDate: "",
    endDate: "",
  },
};

// ==========================================
// 🧠 SLICE
// ==========================================

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    // 🔍 Set Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // 🔄 Reset State
    resetExpenses: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // 📥 Fetch
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Add
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // newest first
      })

      // ✏️ Update
      .addCase(editExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // ❌ Delete
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (e) => e.id !== action.payload
        );
      });
  },
});

// ==========================================
// 📊 SELECTORS (DERIVED STATE)
// ==========================================

// 🔥 Total Expense
export const selectTotal = (state) =>
  state.expenses.items.reduce((sum, e) => sum + e.amount, 0);

// 🔥 Category Breakdown
export const selectByCategory = (state) => {
  const map = {};

  state.expenses.items.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.amount;
  });

  return map;
};

// 🔥 Monthly Trends
export const selectTrends = (state) => {
  const map = {};

  state.expenses.items.forEach((e) => {
    const key = new Date(e.date).toLocaleDateString("en-IN");
    map[key] = (map[key] || 0) + e.amount;
  });

  return Object.entries(map).map(([date, value]) => ({
    date,
    value,
  }));
};

// ==========================================
// EXPORTS
// ==========================================

export const { setFilters, resetExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;