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
  fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2), "utf-8");
};

export const User = {
  findByEmail(email) {
    const users = readUsers();
    return users.find((u) => u.email === email) || null;
  },

  findById(id) {
    const users = readUsers();
    return users.find((u) => u.id === id) || null;
  },

  create({ name, email, password, role = "customer" }) {
    const users = readUsers();

    if (users.find((u) => u.email === email)) {
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

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
