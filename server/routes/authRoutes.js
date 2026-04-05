import express from "express";
import {
  register,
  login,
  refreshToken,
  getProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// 🔓 PUBLIC ROUTES
// ==========================================

// 🧾 Register
router.post("/register", register);

// 🔐 Login
router.post("/login", login);

// 🔁 Refresh Token
router.post("/refresh", refreshToken);

// ==========================================
// 🔐 PROTECTED ROUTES
// ==========================================

// 👤 Get Logged-in User Profile
router.get("/me", protect, getProfile);

export default router;