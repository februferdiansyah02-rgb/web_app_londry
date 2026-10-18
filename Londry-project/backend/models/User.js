import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve("data");
const FILE_PATH = path.join(DATA_DIR, "users.json");

// Pastikan folder data tersedia
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pastikan file users.json tersedia
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, "[]", "utf-8");
}

const readUsers = () => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(
    FILE_PATH,
    JSON.stringify(users, null, 2),
    "utf-8"
  );
};

// Jangan kirim password ke frontend
const withoutPassword = (user) => {
  const { password: _, ...safeUser } = user;
  return safeUser;
};

export const User = {
  findByEmail(email) {
    return readUsers().find((u) => u.email === email) || null;
  },

  findById(id) {
    return readUsers().find((u) => u.id === id) || null;
  },

  create({ name, email, password, role = "customer" }) {
    const users = readUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error("Email sudah terdaftar");
    }

    const user = {
      id: String(Date.now()),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    writeUsers(users);

    return withoutPassword(user);
  },

  updateNameById(id, name) {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("Nama wajib diisi");
    }

    if (name.trim().length > 100) {
      throw new Error("Nama maksimal 100 karakter");
    }

    const users = readUsers();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return null;
    }

    users[index] = {
      ...users[index],
      name: name.trim(),
      updatedAt: new Date().toISOString(),
    };

    writeUsers(users);

    return withoutPassword(users[index]);
  },
};