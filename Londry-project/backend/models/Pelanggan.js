import fs from "fs";
import path from "path";

// Folder dan file untuk menyimpan profil pelanggan
const DATA_DIR = path.resolve("data", "pelanggan");
const FILE_PATH = path.join(DATA_DIR, "profiles.json");

// Pastikan folder tersedia
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Buat file kosong jika belum tersedia
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, "[]", "utf-8");
}

const readProfiles = () => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
};

const writeProfiles = (profiles) => {
  fs.writeFileSync(
    FILE_PATH,
    JSON.stringify(profiles, null, 2),
    "utf-8"
  );
};

export const Pelanggan = {
  findAll() {
    return readProfiles();
  },

  findById(id) {
    return readProfiles().find((p) => p.id === id) || null;
  },

  findByUserId(userId) {
    return readProfiles().find((p) => p.userId === userId) || null;
  },

  create({ userId, name, email, alamat = "", telepon = "" }) {
    const profiles = readProfiles();

    // Cegah profil ganda untuk pengguna yang sama
    if (profiles.some((p) => p.userId === userId)) {
      throw new Error("Profil pelanggan sudah tersedia untuk user ini");
    }

    const now = new Date().toISOString();

    const profile = {
      id: String(Date.now()),
      userId,
      name,
      email,
      alamat,
      telepon,
      createdAt: now,
      updatedAt: now,
    };

    profiles.push(profile);
    writeProfiles(profiles);

    return profile;
  },

  updateByUserId(userId, updates) {
    const profiles = readProfiles();
    const index = profiles.findIndex((p) => p.userId === userId);

    if (index === -1) {
      return null;
    }

    // Batasi kolom yang boleh diperbarui
    const allowedUpdates = {};

    for (const field of ["name", "alamat", "telepon"]) {
      if (updates[field] !== undefined) {
        if (typeof updates[field] !== "string") {
          throw new Error(`${field} harus berupa teks`);
        }

        allowedUpdates[field] = updates[field].trim();
      }
    }

    if (
      allowedUpdates.name !== undefined &&
      allowedUpdates.name.length === 0
    ) {
      throw new Error("Nama tidak boleh kosong");
    }

    profiles[index] = {
      ...profiles[index],
      ...allowedUpdates,
      updatedAt: new Date().toISOString(),
    };

    writeProfiles(profiles);

    return profiles[index];
  },

  removeByUserId(userId) {
    const profiles = readProfiles();
    const index = profiles.findIndex((p) => p.userId === userId);

    if (index === -1) {
      return null;
    }

    const [dihapus] = profiles.splice(index, 1);
    writeProfiles(profiles);

    return dihapus;
  },
};