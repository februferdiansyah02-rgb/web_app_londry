import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DATA_DIR = path.resolve("data");
const FILE_PATH = path.join(DATA_DIR, "pesanan.json");

// Pastikan folder data tersedia
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pastikan file pesanan.json tersedia
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, "[]", "utf-8");
}

const readPesanan = () => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
};

const writePesanan = (pesanan) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(pesanan, null, 2), "utf-8");
};

const STATUS_VALID = [
  "Menunggu konfirmasi",
  "Sedang diproses",
  "Selesai",
  "Dikirim",
  "Dibatalkan",
];

export const Pesanan = {
  findAll() {
    return readPesanan();
  },

  findById(id) {
    return readPesanan().find((p) => p.id === id) || null;
  },

  findByUserId(userId) {
    return readPesanan().filter((p) => p.userId === userId);
  },

  create({
    userId,
    namaPelanggan,
    namaOutlet,
    layanan,
    berat,
    totalHarga,
    alamat,
    estimasi,
    status = "Menunggu konfirmasi",
  }) {
    const pesanan = readPesanan();

    if (!STATUS_VALID.includes(status)) {
      throw new Error("Status pesanan tidak valid");
    }

    const now = new Date().toISOString();
    const id = `PSN-${uuidv4().slice(0, 8).toUpperCase()}`;

    const baru = {
      id,
      userId,
      namaPelanggan,
      namaOutlet,
      layanan,
      berat: Number(berat) || 0,
      totalHarga: Number(totalHarga) || 0,
      alamat: alamat || "",
      estimasi: estimasi || "",
      status,
      createdAt: now,
      updatedAt: now,
    };

    pesanan.push(baru);
    writePesanan(pesanan);

    return baru;
  },

  update(id, updates) {
    const pesanan = readPesanan();
    const index = pesanan.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }

    if (updates.status && !STATUS_VALID.includes(updates.status)) {
      throw new Error("Status pesanan tidak valid");
    }

    pesanan[index] = {
      ...pesanan[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    writePesanan(pesanan);
    return pesanan[index];
  },

  remove(id) {
    const pesanan = readPesanan();
    const index = pesanan.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }

    const [dihapus] = pesanan.splice(index, 1);
    writePesanan(pesanan);
    return dihapus;
  },

  getValidStatuses() {
    return STATUS_VALID;
  },
};
