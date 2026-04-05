import { useMemo, useState } from "react";

// 🔹 Currency formatter
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const Reports = ({ expenses = [] }) => {
  const [filters, setFilters] = useState({
    category: "All",
    startDate: "",
    endDate: "",
    search: "",
  });

  // 🔥 Filtered Data
  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const date = new Date(e.date);

      if (filters.startDate && date < new Date(filters.startDate)) return false;
      if (filters.endDate && date > new Date(filters.endDate)) return false;

      if (filters.category !== "All" && e.category !== filters.category)
        return false;

      if (
        filters.search &&
        !e.note?.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;

      return true;
    });
  }, [expenses, filters]);

  // 🔥 Monthly Aggregation
  const monthlyData = useMemo(() => {
    const map = {};

    filtered.forEach((e) => {
      const key = new Date(e.date).toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
      });

      map[key] = (map[key] || 0) + e.amount;
    });

    return Object.entries(map).map(([month, total]) => ({
      month,
      total,
    }));
  }, [filtered]);

  // 🔥 Category Summary
  const categorySummary = useMemo(() => {
    const map = {};

    filtered.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    return Object.entries(map);
  }, [filtered]);

  // 🔥 Export CSV
  const exportCSV = () => {
    const headers = ["Date", "Category", "Amount", "Note"];

    const rows = filtered.map((e) => [
      e.date,
      e.category,
      e.amount,
      e.note || "",
    ]);

    const csvContent =
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses_report.csv";
    a.click();
  };

  return (
    <div className="p-6 space-y-6">

      {/* 🔹 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📁 Reports</h1>
        <button
          onClick={exportCSV}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>

      {/* 🔍 Filters */}
      <div className="grid md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow">
        
        <input
          type="text"
          placeholder="Search notes..."
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          className="border p-2 rounded"
        />

        <select
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option>All</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
        </select>

        <input
          type="date"
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="date"
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
          className="border p-2 rounded"
        />
      </div>

      {/* 📊 Monthly Summary */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Monthly Summary</h2>
        {monthlyData.map((m, i) => (
          <div key={i} className="flex justify-between py-1">
            <span>{m.month}</span>
            <span>{formatCurrency(m.total)}</span>
          </div>
        ))}
      </div>

      {/* 📊 Category Summary */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Category Summary</h2>
        {categorySummary.map(([cat, total], i) => (
          <div key={i} className="flex justify-between py-1">
            <span>{cat}</span>
            <span>{formatCurrency(total)}</span>
          </div>
        ))}
      </div>

      {/* 📋 Detailed Table */}
      <div className="bg-white p-4 rounded-xl shadow overflow-auto">
        <h2 className="font-semibold mb-2">Transactions</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Date</th>
              <th className="text-left">Category</th>
              <th className="text-left">Note</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((e) => (
              <tr key={e._id || e.id} className="border-b">
                <td className="py-2">
                  {new Date(e.date).toLocaleDateString()}
                </td>
                <td>{e.category}</td>
                <td>{e.note || "-"}</td>
                <td className="text-right">
                  {formatCurrency(e.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No data found
          </p>
        )}
      </div>
    </div>
  );
};

export default Reports;