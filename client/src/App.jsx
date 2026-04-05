import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔹 Layout
import AppLayout from "./layout/AppLayout";

// 🔹 Pages
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Reports from "./pages/Reports";

// 🔹 Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// 🔹 Route Protection
import ProtectedRoute from "./routes/ProtectedRoute";

// 🔹 Context Providers
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

// 🔹 Redux
import { Provider } from "react-redux";
import store from "./store";

// 🔹 Optional: 404 Page
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NotificationProvider>
          <Router>

            <Routes>

              {/* 🔓 Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 🔐 Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AddExpense />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* 🔐 Admin Route (Role-Based) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AppLayout>
                      <h1 className="text-xl font-bold">
                        Admin Panel 🔐
                      </h1>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* ❌ 404 */}
              <Route path="*" element={<NotFound />} />

            </Routes>

          </Router>
        </NotificationProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;