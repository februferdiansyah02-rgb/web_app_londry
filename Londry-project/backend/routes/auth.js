import express from "express";
import { register, login, me } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me (butuh token)
router.get("/me", authenticateToken, me);

export default router;
