import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();
await connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🩺 Health Check
app.get("/", (req, res) => res.send("💰 Expense Tracker API is running..."));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 🔥 Handle Unhandled Rejections
process.on("unhandledRejection", (err) => {
  console.error("🔴 UNHANDLED REJECTION:", err.message);
  // server.close(() => process.exit(1));
});

// 🔥 Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("🔴 UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});