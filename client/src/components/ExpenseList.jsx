import { useMemo } from "react";

// 🔹 Category Icons (sync with form)
const CATEGORY_ICONS = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "💡",
  Health: "🏥",
  Entertainment: "🎬",
  Other: "📦",
};

// 🔹 Format date label
const getDateLabel = (date) => {
  const today = new Date();
  const d = new Date(date);

  const isToday = d.toDateString() === today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// 🔹 Currency format
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const ExpenseList = ({ expenses = [], onDelete, onEdit }) => {
  
  // 🔥 Group expenses by date label
  const groupedExpenses = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      const label = getDateLabel(exp.date);
      if (!acc[label]) acc[label] = [];
      acc[label].push(exp);
      return acc;
    }, {});
  }, [expenses]);

  // 🔥 Calculate total
  const total = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">

      {/* 🔥 Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Expenses</h2>
        <span className="text-lg font-semibold text-green-600">
          {formatCurrency(total)}
        </span>
      </div>

      {/* ❌ Empty State */}
      {expenses.length === 0 && (
        <div className="text-center py-10 border rounded-xl bg-gray-50">
          <p className="text-gray-500">No expenses yet</p>
          <p className="text-sm text-gray-400">
            Start adding your daily spending 💸
          </p>
        </div>
      )}

      {/* 🔹 Grouped List */}
      {Object.entries(groupedExpenses).map(([label, group]) => (
        <div key={label} className="space-y-2">
          
          {/* Date Header */}
          <h3 className="text-sm font-semibold text-gray-500">
            {label}
          </h3>

          {/* Items */}
          {group.map((exp) => (
            <div
              key={exp._id || exp.id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >
              
              {/* Left */}
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {CATEGORY_ICONS[exp.category] || "📌"}
                </span>

                <div>
                  <p className="font-medium">{exp.category}</p>
                  <p className="text-xs text-gray-500">
                    {exp.note || "No note"}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                <span className="font-semibold">
                  {formatCurrency(exp.amount)}
                </span>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(exp)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(exp._id || exp.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;