import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// 🔹 Colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

// 🔹 Currency formatter
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const Dashboard = ({ expenses = [] }) => {
  const [filter, setFilter] = useState({
    category: "All",
    startDate: "",
    endDate: "",
  });

  // 🔥 Filter Logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const date = new Date(e.date);

      if (
        filter.startDate &&
        date < new Date(filter.startDate)
      )
        return false;

      if (
        filter.endDate &&
        date > new Date(filter.endDate)
      )
        return false;

      if (
        filter.category !== "All" &&
        e.category !== filter.category
      )
        return false;

      return true;
    });
  }, [expenses, filter]);

  // 🔥 KPI Calculations
  const total = useMemo(
    () =>
      filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const avg = useMemo(
    () => (filteredExpenses.length ? total / filteredExpenses.length : 0),
    [filteredExpenses, total]
  );

  // 🔥 Category Data
  const categoryData = useMemo(() => {
    const map = {};

    filteredExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredExpenses]);

  // 🔥 Trend Data (daily)
  const trendData = useMemo(() => {
    const map = {};

    filteredExpenses.forEach((e) => {
      const day = new Date(e.date).toLocaleDateString("en-IN");
      map[day] = (map[day] || 0) + e.amount;
    });

    return Object.entries(map).map(([date, value]) => ({
      date,
      value,
    }));
  }, [filteredExpenses]);

  return (
    <div className="p-6 space-y-6">

      {/* 🔹 Header */}
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {/* 🔍 Filters */}
      <div className="grid md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow">
        
        <select
          onChange={(e) =>
            setFilter({ ...filter, category: e.target.value })
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
            setFilter({ ...filter, startDate: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="date"
          onChange={(e) =>
            setFilter({ ...filter, endDate: e.target.value })
          }
          className="border p-2 rounded"
        />
      </div>

      {/* 💰 KPI Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total</p>
          <h2 className="text-xl font-bold">{formatCurrency(total)}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Average</p>
          <h2 className="text-xl font-bold">{formatCurrency(avg)}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Transactions</p>
          <h2 className="text-xl font-bold">
            {filteredExpenses.length}
          </h2>
        </div>
      </div>

      {/* 📊 Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow h-80">
          <h3 className="mb-2 font-semibold">Category Split</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 rounded-xl shadow h-80">
          <h3 className="mb-2 font-semibold">Spending Trend</h3>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;