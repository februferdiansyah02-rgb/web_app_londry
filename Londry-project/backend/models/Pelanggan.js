import fs from "fs";
import path from "path";

// Folder dan file untuk menyimpan profil pelanggan
const DATA_DIR = path.resolve("data", "pelanggan");
const FILE_PATH = path.join(DATA_DIR, "profiles.json");

// Pastikan folder data/pelanggan tersedia
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pastikan file profiles.json tersedia
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, "[]", "utf-8");
}

const readProfiles = () => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
};

const writeProfiles = (profiles) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(profiles, null, 2), "utf-8");
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

    // Cegah duplikasi profil untuk user yang sama
    if (profiles.find((p) => p.userId === userId)) {
      throw new Error("Profil pelanggan sudah tersedia untuk user ini");
    }

    const profile = {
      id: String(Date.now()),
      userId,
      name,
      email,
      alamat,
      telepon,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

    profiles[index] = {
      ...profiles[index],
      ...updates,
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
