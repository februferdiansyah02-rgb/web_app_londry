import express from "express";
import { Pelanggan } from "../models/Pelanggan.js";
import { User } from "../models/User.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

// Ambil profil akun yang sedang login
router.get("/me", (req, res) => {
  try {
    const user = User.findById(req.user.id);
    const profile = Pelanggan.findByUserId(req.user.id);

    if (!user || !profile) {
      return res.status(404).json({
        success: false,
        message: "Akun atau profil pelanggan tidak ditemukan",
      });
    }

    const { password: _, ...safeUser } = user;

    return res.json({
      success: true,
      user: safeUser,
      profile,
    });
  } catch (error) {
    console.error("Gagal mengambil profil:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil profil",
    });
  }
});

// Simpan perubahan profil akun yang sedang login
router.put("/me", (req, res) => {
  try {
    const { name, alamat, telepon } = req.body || {};

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama wajib diisi",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Nama maksimal 100 karakter",
      });
    }

    if (
      typeof alamat !== "string" ||
      alamat.trim().length > 500
    ) {
      return res.status(400).json({
        success: false,
        message: "Alamat harus berupa teks, maksimal 500 karakter",
      });
    }

    if (
      typeof telepon !== "string" ||
      telepon.trim().length > 25
    ) {
      return res.status(400).json({
        success: false,
        message: "Nomor HP harus berupa teks, maksimal 25 karakter",
      });
    }

    const nomorHP = telepon.trim();

    if (nomorHP && !/^[0-9+()\s-]+$/.test(nomorHP)) {
      return res.status(400).json({
        success: false,
        message: "Format nomor HP tidak valid",
      });
    }

    const existingUser = User.findById(req.user.id);
    const existingProfile = Pelanggan.findByUserId(req.user.id);

    if (!existingUser || !existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Akun atau profil pelanggan tidak ditemukan",
      });
    }

    const profile = Pelanggan.updateByUserId(req.user.id, {
      name: name.trim(),
      alamat: alamat.trim(),
      telepon: nomorHP,
    });

    const user = User.updateNameById(req.user.id, name.trim());

    return res.json({
      success: true,
      message: "Profil berhasil disimpan",
      user,
      profile,
    });
  } catch (error) {
    console.error("Gagal menyimpan profil:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan profil. Silakan coba lagi.",
    });
  }
});

export default router;