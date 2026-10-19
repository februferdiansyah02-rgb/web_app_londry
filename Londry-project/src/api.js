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

// ---------- Auth ----------

// Login (role opsional: "customer", "outlet"/"mitra", "admin")
export const apiLogin = (email, password, role) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
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

// ---------- Profil ----------

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

// ---------- Pesanan ----------

// Buat pesanan baru (pelanggan)
export const apiCreatePesanan = (token, pesananData) =>
  request("/pesanan", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pesananData),
  });

// Ambil daftar pesanan saya (pelanggan)
export const apiGetPesananSaya = (token) =>
  request("/pesanan/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Ambil detail pesanan berdasarkan ID
export const apiGetPesananById = (token, id) =>
  request(`/pesanan/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Ubah status pesanan (admin / outlet)
export const apiUpdateStatusPesanan = (token, id, status) =>
  request(`/pesanan/${id}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

// Batalkan pesanan
export const apiBatalkanPesanan = (token, id) =>
  request(`/pesanan/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Ambil semua pesanan (hanya admin)
export const apiGetAllPesanan = (token) =>
  request("/pesanan", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Ambil pesanan masuk ke outlet yang sedang login (outlet/mitra)
export const apiGetPesananOutlet = (token) =>
  request("/pesanan/outlet/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
