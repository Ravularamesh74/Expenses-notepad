import { useState } from "react";
import api from "../../services/api";
import { useNavigate, NavLink } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

const Register = () => {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", data);
      showNotification("Account created successfully", "success");
      navigate("/login");
    } catch (err) {
      showNotification(err.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Join 💰 Tracker</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border rounded"
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
          <button className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <NavLink to="/login" className="text-blue-600 underline">Login</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
