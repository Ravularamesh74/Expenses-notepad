import { useEffect, useMemo, useRef, useState } from "react";

// 🔹 Utility: Currency formatter (INR)
const formatCurrency = (value) => {
  if (!value) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
};

// 🔹 Default categories with icons
const CATEGORY_CONFIG = [
  { name: "Food", icon: "🍔" },
  { name: "Transport", icon: "🚗" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Bills", icon: "💡" },
  { name: "Health", icon: "🏥" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Other", icon: "📦" },
];

// 🔹 Validation Schema
const validateExpense = (data) => {
  const errors = {};

  if (!data.amount || data.amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (!data.category) {
    errors.category = "Category is required";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }

  return errors;
};

const ExpenseForm = ({ onSubmit, loading }) => {
  const initialState = {
    amount: "",
    category: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  };

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);

  const amountRef = useRef();

  // 🔥 Autofocus on mount
  useEffect(() => {
    amountRef.current?.focus();
  }, []);

  // 🔥 Auto-save draft to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("expense_draft", JSON.stringify(form));
      setDraftSaved(true);
    }, 800);

    return () => clearTimeout(timeout);
  }, [form]);

  // 🔥 Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem("expense_draft");
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? value.replace(/^0+/, "") : value,
    }));

    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // 🔹 Smart validation (live)
  useEffect(() => {
    setErrors(validateExpense(form));
  }, [form]);

  // 🔥 Derived total preview
  const formattedAmount = useMemo(
    () => formatCurrency(form.amount),
    [form.amount]
  );

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateExpense(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    await onSubmit({
      ...form,
      amount: Number(form.amount),
    });

    localStorage.removeItem("expense_draft");
    setForm(initialState);
    setTouched({});
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-xl border">
      <h2 className="text-2xl font-bold mb-4">💸 Add Expense</h2>

      {/* 💡 Draft indicator */}
      {draftSaved && (
        <p className="text-xs text-green-500 mb-2">
          Draft auto-saved
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Amount */}
        <div>
          <label className="text-sm font-medium">Amount</label>
          <input
            ref={amountRef}
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            className="w-full border p-3 rounded-lg mt-1"
          />
          {form.amount && (
            <p className="text-xs text-gray-500 mt-1">
              {formattedAmount}
            </p>
          )}
          {touched.amount && errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount}</p>
          )}
        </div>

        {/* Category Grid */}
        <div>
          <label className="text-sm font-medium">Category</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {CATEGORY_CONFIG.map((cat) => (
              <button
                type="button"
                key={cat.name}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    category: cat.name,
                  }))
                }
                className={`p-2 rounded-lg border text-sm ${
                  form.category === cat.name
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          {touched.category && errors.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mt-1"
          />
        </div>

        {/* Note */}
        <div>
          <label className="text-sm font-medium">Note</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Optional description..."
            className="w-full border p-3 rounded-lg mt-1 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;