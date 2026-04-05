import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// 🔹 Navigation items
const NAV_ITEMS = [
  { name: "Dashboard", path: "/" },
  { name: "Add Expense", path: "/add" },
  { name: "Reports", path: "/reports" },
];

// 🔹 Dark mode hook
const useDarkMode = () => {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return [dark, setDark];
};

import { useAuth } from "../context/AuthContext";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dark, setDark] = useDarkMode();
  const navigate = useNavigate();

  // 🔥 Close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setProfileOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* 🔹 Logo */}
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          💰 ExpenseTracker
        </div>

        {/* 🔹 Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="text-lg"
          >
            {dark ? "🌙" : "☀️"}
          </button>

          {/* 👤 Profile */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((prev) => !prev);
              }}
              className="flex items-center gap-2"
            >
              <span className="text-sm">
                {user?.name || "User"}
              </span>
              <span>👤</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-40 py-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  Profile
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 📱 Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white dark:bg-gray-900">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 dark:text-gray-300"
            >
              {item.name}
            </NavLink>
          ))}

          {/* Dark Mode */}
          <button
            onClick={() => setDark(!dark)}
            className="block w-full text-left"
          >
            {dark ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="block w-full text-left text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;