import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      showNotification("Logged in successfully", "success");
      navigate("/");
    } catch (err) {
      showNotification(err.message || "Invalid credentials", "error");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Login 💰 Tracker</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
          <button className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          No account? <NavLink to="/register" className="text-blue-600 underline">Register</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
