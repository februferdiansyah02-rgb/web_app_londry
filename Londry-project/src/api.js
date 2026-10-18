const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const { headers, ...otherOptions } = options;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...otherOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  let data;

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const error = new Error(
      data.message || "Terjadi kesalahan pada server"
    );

    error.status = res.status;
    error.data = data;

    throw error;
  }

  return data;
}

// Login
export const apiLogin = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Registrasi
export const apiRegister = (userData) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

// Ambil data akun yang sedang login
export const apiGetMe = (token) =>
  request("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Ambil profil pelanggan yang sedang login
export const apiGetProfil = (token) =>
  request("/profil/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Simpan nama, alamat, dan nomor HP
export const apiUpdateProfil = (token, { name, alamat, telepon }) =>
  request("/profil/me", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      alamat,
      telepon,
    }),
  });