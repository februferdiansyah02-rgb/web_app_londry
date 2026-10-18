import express from "express";
import {
  createPesanan,
  getPesananSaya,
  getAllPesanan,
  getPesananById,
  updateStatusPesanan,
  batalkanPesanan,
} from "../controllers/pesananController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// POST /api/pesanan - Buat pesanan baru (pelanggan)
router.post("/", authenticateToken, createPesanan);

// GET /api/pesanan/me - Pesanan saya (pelanggan)
router.get("/me", authenticateToken, getPesananSaya);

// GET /api/pesanan - Semua pesanan (hanya admin)
router.get("/", authenticateToken, authorizeRoles("admin"), getAllPesanan);

// GET /api/pesanan/:id - Detail pesanan
router.get("/:id", authenticateToken, getPesananById);

// PUT /api/pesanan/:id/status - Perbarui status (admin/outlet)
router.put(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin", "outlet"),
  updateStatusPesanan
);

// DELETE /api/pesanan/:id - Batalkan pesanan
router.delete("/:id", authenticateToken, batalkanPesanan);

export default router;
