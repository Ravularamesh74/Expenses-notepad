import { useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// 🔹 Route Title Mapping
const routeTitles = {
  "/": "Dashboard",
  "/add": "Add Expense",
  "/reports": "Reports",
  "/admin": "Admin Panel",
};

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = routeTitles[location.pathname] || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      
      {/* 📱 Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🧭 Sidebar */}
      <div
        className={`
          fixed md:static z-50 h-full
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* 🧱 Main Content */}
      <div className="flex-1 flex flex-col w-full">
        
        {/* 🔹 Top Navbar */}
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* 🔥 Page Header */}
        <div className="px-6 py-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-bold">{title}</h1>
        </div>

        {/* 📦 Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* 🔻 Footer (Optional but pro-level) */}
        <footer className="text-center text-xs text-gray-500 py-3">
          © {new Date().getFullYear()} Expense Tracker • Built like a fintech app 🚀
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;