const API_BASE = (import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const error = new Error(data.message || "Terjadi kesalahan pada server");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiLogin = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const apiRegister = (userData) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const apiGetMe = (token) =>
  request("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
