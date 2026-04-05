import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

// 🔹 Menu Config
const baseMenu = [
  { name: "Dashboard", path: "/", icon: "📊" },
  { name: "Add Expense", path: "/add", icon: "➕" },
  { name: "Reports", path: "/reports", icon: "📁" },
];

const adminMenu = [
  { name: "Admin Panel", path: "/admin", icon: "🔐" },
];

const Sidebar = ({ closeSidebar }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // 🔥 Combine menu based on role
  const menu = [
    ...baseMenu,
    ...(user?.role === "admin" ? adminMenu : []),
  ];

  return (
    <div
      className={`
        h-full bg-gray-900 text-white flex flex-col
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      
      {/* 🔹 Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <h2 className="text-lg font-bold">💰 Tracker</h2>}

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sm"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* 🔹 Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>

            {!collapsed && (
              <span className="text-sm font-medium">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 🔻 Footer */}
      <div className="p-3 border-t border-gray-700 text-xs text-gray-400">
        {!collapsed && (
          <p>© {new Date().getFullYear()} Expense Tracker</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;