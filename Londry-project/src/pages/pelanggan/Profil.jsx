import { useEffect, useState } from "react";
import { apiGetProfil, apiUpdateProfil } from "../../api";

export default function Profil({
  token,
  user,
  profile,
  onProfileUpdated,
  onLogout,
}) {
  const [form, setForm] = useState({
    name: "",
    telepon: "",
    alamat: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reload, setReload] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setLoaded(false);
      setError("");
      setSuccess("");

      try {
        const data = await apiGetProfil(token);

        if (!active) return;

        setForm({
          name: data.profile.name || "",
          telepon: data.profile.telepon || "",
          alamat: data.profile.alamat || "",
        });

        onProfileUpdated(data);
        setLoaded(true);
      } catch (err) {
        if (!active) return;

        setError(
          err.status === 401 || err.status === 403
            ? "Sesi login tidak valid. Silakan keluar dan login kembali."
            : err.message || "Profil gagal dimuat."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [token, reload, onProfileUpdated]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving || loading || !loaded) return;

    if (!form.name.trim()) {
      setError("Nama wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiUpdateProfil(token, form);

      setForm({
        name: data.profile.name || "",
        telepon: data.profile.telepon || "",
        alamat: data.profile.alamat || "",
      });

      onProfileUpdated(data);
      setSuccess(data.message || "Profil berhasil disimpan.");
    } catch (err) {
      setError(
        err.status === 401 || err.status === 403
          ? "Sesi login tidak valid. Silakan keluar dan login kembali."
          : err.message || "Profil gagal disimpan."
      );
    } finally {
      setSaving(false);
    }
  }

  const displayName = profile?.name || user?.name || "Pelanggan";
  const initial = displayName.trim().charAt(0).toUpperCase() || "P";
  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
      <header className="mb-6">
        <p className="text-sm font-semibold text-blue-600">Akun saya</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Profil Pelanggan
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Kelola informasi pribadi dan alamat laundry kamu.
        </p>
      </header>

      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-blue-100 bg-blue-50 p-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
            {initial}
          </div>

          <div className="min-w-0">
            <h2 className="break-words text-xl font-bold text-gray-900">
              {displayName}
            </h2>
            <p className="break-all text-sm text-gray-500">
              {user?.email || profile?.email || "-"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {loading && (
            <p role="status" className="text-sm text-blue-600">
              Memuat profil...
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              <p>{error}</p>

              {!loaded && !loading && (
                <button
                  type="button"
                  onClick={() => setReload((value) => value + 1)}
                  className="mt-2 font-semibold underline"
                >
                  Coba lagi
                </button>
              )}
            </div>
          )}

          {success && (
            <p
              role="status"
              className="rounded-xl bg-green-50 p-4 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <fieldset
            disabled={loading || saving || !loaded}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="profile-name"
                className="text-sm font-semibold text-gray-700"
              >
                Nama lengkap
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                required
                placeholder="Masukkan nama lengkap"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={user?.email || profile?.email || ""}
                readOnly
                className={`${inputClass} text-gray-500`}
              />
              <p className="mt-2 text-xs text-gray-500">
                Email mengikuti akun yang digunakan saat registrasi.
              </p>
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="text-sm font-semibold text-gray-700"
              >
                Nomor HP
              </label>
              <input
                id="profile-phone"
                name="telepon"
                type="tel"
                autoComplete="tel"
                value={form.telepon}
                onChange={handleChange}
                maxLength={25}
                placeholder="Contoh: 081234567890"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="profile-address"
                className="text-sm font-semibold text-gray-700"
              >
                Alamat
              </label>
              <textarea
                id="profile-address"
                name="alamat"
                autoComplete="street-address"
                value={form.alamat}
                onChange={handleChange}
                maxLength={500}
                rows={3}
                placeholder="Nama jalan, nomor rumah, dan detail alamat"
                className={`${inputClass} resize-y`}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Menyimpan..." : "Simpan perubahan"}
            </button>
          </fieldset>
        </form>
      </section>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5">
        <p className="text-sm text-gray-500">
          Selesai menggunakan akun?
        </p>
        <button
          type="button"
          disabled={saving}
          onClick={onLogout}
          className="shrink-0 rounded-xl bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}