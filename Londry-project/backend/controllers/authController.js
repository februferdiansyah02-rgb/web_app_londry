import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/User.js";
import { Pelanggan } from "../models/Pelanggan.js";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_default";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, outletName: user.outletName || null },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, alamat, telepon, outletName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter",
      });
    }

    const existing = User.findByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      outletName,
    });

    // Buat profil pelanggan hanya untuk role customer (pelanggan)
    let profile = null;
    if ((role || "customer") === "customer") {
      profile = Pelanggan.create({
        userId: user.id,
        name: user.name,
        email: user.email,
        alamat: alamat || "",
        telepon: telepon || "",
      });
    }

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      token,
      user,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const token = generateToken(user);

    const { password: _, ...userWithoutPassword } = user;

    // Ambil profil pelanggan agar data alamat tersedia setelah login
    const profile = Pelanggan.findByUserId(user.id);

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: userWithoutPassword,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};

export const me = (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    // Sertakan profil pelanggan (alamat, telepon, dll.)
    const profile = Pelanggan.findByUserId(user.id);

    res.json({
      success: true,
      user: userWithoutPassword,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};
