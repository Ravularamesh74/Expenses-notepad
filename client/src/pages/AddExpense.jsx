import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ExpenseForm from "../components/ExpenseForm";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

// 🔹 Mock API (replace with real backend)
const createExpenseAPI = async (data, token) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data });
    }, 800);
  });
};

const AddExpense = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user } = useAuth();

  // 🔥 Submit handler (core logic)
  const handleAddExpense = async (expenseData) => {
    try {
      setLoading(true);

      // Attach user ID
      const payload = {
        ...expenseData,
        userId: user?.id,
      };

      // 🔥 API Call
      const res = await createExpenseAPI(
        payload,
        localStorage.getItem("token")
      );

      if (res.success) {
        showNotification("Expense added successfully ✅", "success");

        // 🔥 Redirect after success
        navigate("/");
      } else {
        throw new Error("Failed to add expense");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error adding expense ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      
      {/* 🔹 Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          ➕ Add New Expense
        </h1>
        <p className="text-gray-500 text-sm">
          Track your spending efficiently
        </p>
      </div>

      {/* 🔹 Form */}
      <ExpenseForm
        onSubmit={handleAddExpense}
        loading={loading}
      />
    </div>
  );
};

export default AddExpense;