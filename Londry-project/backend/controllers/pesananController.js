import { Pesanan } from "../models/Pesanan.js";
import { User } from "../models/User.js";

export const createPesanan = async (req, res) => {
  try {
    const {
      namaOutlet,
      layanan,
      berat,
      totalHarga,
      alamat,
      estimasi,
    } = req.body;

    if (!namaOutlet || !layanan) {
      return res.status(400).json({
        success: false,
        message: "Nama outlet dan layanan wajib diisi",
      });
    }

    // Ambil nama pelanggan dari data user (karena JWT hanya menyimpan id/email/role)
    const user = User.findById(req.user.id);
    const namaPelanggan = user ? user.name : "Pelanggan";

    const pesanan = Pesanan.create({
      userId: req.user.id,
      namaPelanggan,
      namaOutlet,
      layanan,
      berat,
      totalHarga,
      alamat,
      estimasi,
      status: "Menunggu konfirmasi",
    });

    return res.status(201).json({
      success: true,
      message: "Pesanan londry berhasil dibuat",
      pesanan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};

export const getPesananOutlet = (req, res) => {
  try {
    // Ambil data user lengkap dari database untuk nama outlet
    const user = User.findById(req.user.id);
    const outletName = (user && user.outletName) || user.name || "Outlet";

    let daftar = Pesanan.findAll();

    // Filter pesanan yang masuk ke outlet ini (berdasarkan namaOutlet)
    if (outletName) {
      daftar = daftar.filter((p) => p.namaOutlet === outletName);
    }

    // Urutkan terbaru dulu
    daftar.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    return res.json({
      success: true,
      message: `Daftar pesanan outlet ${outletName}`,
      data: daftar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};

export const getPesananSaya = (req, res) => {
  try {
    const daftar = Pesanan.findByUserId(req.user.id);
    // Urutkan terbaru dulu
    daftar.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json({
      success: true,
      message: "Daftar pesanan Anda",
      data: daftar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};

export const getAllPesanan = (req, res) => {
  try {
    const daftar = Pesanan.findAll();
    daftar.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json({
      success: true,
      message: "Semua pesanan londry",
      data: daftar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};

export const getPesananById = (req, res) => {
  try {
    const pesanan = Pesanan.findById(req.params.id);
    if (!pesanan) {
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan",
      });
    }

    // Pelanggan hanya boleh lihat pesanan sendiri
    if (
      req.user.role === "customer" &&
      pesanan.userId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak berhak melihat pesanan ini",
      });
    }

    return res.json({
      success: true,
      message: "Detail pesanan",
      data: pesanan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};

export const updateStatusPesanan = (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status wajib diisi",
      });
    }

    const pesanan = Pesanan.update(req.params.id, { status });
    if (!pesanan) {
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      message: "Status pesanan diperbarui",
      data: pesanan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};

export const batalkanPesanan = (req, res) => {
  try {
    const pesanan = Pesanan.findById(req.params.id);
    if (!pesanan) {
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan",
      });
    }

    // Pelanggan hanya boleh batalkan pesanan sendiri
    if (
      req.user.role === "customer" &&
      pesanan.userId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak berhak membatalkan pesanan ini",
      });
    }

    // Tidak bisa membatalkan pesanan yang sudah selesai/dikirim/dibatalkan
    if (["Selesai", "Dikirim", "Dibatalkan"].includes(pesanan.status)) {
      return res.status(400).json({
        success: false,
        message: "Pesanan tidak dapat dibatalkan lagi",
      });
    }

    Pesanan.update(req.params.id, { status: "Dibatalkan" });

    return res.json({
      success: true,
      message: "Pesanan berhasil dibatalkan",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};
