import React, { useCallback, useEffect, useState } from "react";
import {
  apiCreatePesanan,
  apiGetPesananSaya,
  apiGetProfil,
} from "./api";
import Login from "./pages/login";
import Register from "./pages/registrasi";
import LupaKataSandi from "./pages/lupa-kata-sandi";
import Navigation from "./component/Navigation";
import BerandaPelanggan from "./pages/pelanggan/beranda";
import DashboardMitra from "./pages/mitra-londry/DashboardMitra";
import DetailOutlet from "./pages/pelanggan/DetailOutlet";
import RincianPesanan from "./pages/pelanggan/RincianPesanan";
import PetaOutlet from "./pages/pelanggan/petaoutlet";
import PetaPengiriman from "./pages/pelanggan/PetaPengiriman";
import PesananSaya from "./pages/pelanggan/pesananpelanggan";
import Profil from "./pages/pelanggan/Profil";

const DISPLAY_ROLE = {
  customer: "Pelanggan",
  outlet: "Mitra Laundry",
  admin: "Admin",
};

function readStoredData(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState(() =>
    localStorage.getItem("token") ? "home" : "login"
  );

  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => readStoredData("user"));
  const [profile, setProfile] = useState(() =>
    readStoredData("profile")
  );

  const [activeMenu, setActiveMenu] = useState("Beranda");
  const [userRole, setUserRole] = useState(
    user ? DISPLAY_ROLE[user.role] || "Pelanggan" : "Pelanggan"
  );

  const [homeView, setHomeView] = useState("utama");

  // Data outlet yang dipilih dari Beranda.
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  const [daftarPesanan, setDaftarPesanan] = useState([]);
  const [pesananLoading, setPesananLoading] = useState(false);

  const [selectedPesanan, setSelectedPesanan] = useState(null);
  const [pesananView, setPesananView] = useState("daftar");

  // Muat daftar pesanan dari API saat token tersedia.
  useEffect(() => {
    let active = true;

    const loadPesanan = async () => {
      if (!token) return;
      setPesananLoading(true);
      try {
        const data = await apiGetPesananSaya(token);
        if (!active) return;
        const daftar = (data.data || []).map((p) => ({
          id: p.id,
          namaOutlet: p.namaOutlet,
          layanan: p.layanan,
          status: p.status,
          estimasi: p.estimasi || "",
          waktu: p.createdAt || "",
          totalHarga: p.totalHarga,
          alamat: p.alamat,
          userId: p.userId,
        }));
        setDaftarPesanan(daftar);
      } catch (err) {
        if (!active) return;
        console.warn("Gagal memuat pesanan:", err.message);
        setDaftarPesanan([]);
      } finally {
        if (active) setPesananLoading(false);
      }
    };

    loadPesanan();

    return () => {
      active = false;
    };
  }, [token]);

  const handleTambahPesanan = async (pesananBaru) => {
    if (!token) return;

    try {
      const data = await apiCreatePesanan(token, {
        namaOutlet: pesananBaru.namaOutlet,
        layanan: pesananBaru.layanan,
        berat: pesananBaru.berat || 1,
        totalHarga: pesananBaru.totalHarga || 0,
        alamat: pesananBaru.alamatOutlet || "",
        estimasi: pesananBaru.estimasi || "",
      });

      const p = data.pesanan;
      const baru = {
        id: p.id,
        namaOutlet: p.namaOutlet,
        layanan: p.layanan,
        status: p.status,
        estimasi: p.estimasi || "",
        waktu: p.createdAt || "",
        totalHarga: p.totalHarga,
        alamat: p.alamat,
      };

      setDaftarPesanan((previous) => [baru, ...previous]);
    } catch (err) {
      console.error("Gagal membuat pesanan:", err.message);
      // Fallback: tambahkan secara lokal agar UI tidak macet
      setDaftarPesanan((previous) => [pesananBaru, ...previous]);
    }
  };

  const handlePilihOutlet = (outlet) => {
    if (!outlet) return;

    setSelectedOutlet(outlet);
    setHomeView("detail-outlet");
  };

  const handleTutupOutlet = () => {
    setHomeView("utama");
    setSelectedOutlet(null);
  };

  // Sinkronkan data akun setelah profil dimuat atau disimpan.
  const handleProfileUpdated = useCallback(
    ({ user: updatedUser, profile: updatedProfile }) => {
      setUser(updatedUser);
      setProfile(updatedProfile);

      try {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem(
          "profile",
          JSON.stringify(updatedProfile)
        );
      } catch (error) {
        console.warn("Cache profil tidak dapat diperbarui:", error);
      }
    },
    []
  );

  const handleLoginSuccess = ({
    token: newToken,
    user: newUser,
    profile: newProfile,
    role: roleOverride,
  }) => {
    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile ?? null);
    // Gunakan role yang dikirim dari login (tab yang dipilih) sebagai prioritas,
    // lalu fallback ke role dari data user server.
    const roleDariServer = DISPLAY_ROLE[newUser.role] || "Pelanggan";
    setUserRole(roleOverride ? DISPLAY_ROLE[roleOverride] || roleDariServer : roleDariServer);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    if (newProfile) {
      localStorage.setItem("profile", JSON.stringify(newProfile));
    } else {
      localStorage.removeItem("profile");
    }

    setCurrentPage("home");
    setActiveMenu("Beranda");
    setHomeView("utama");
    setSelectedOutlet(null);
    setSelectedPesanan(null);
    setPesananView("daftar");
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    setUserRole("Pelanggan");
    setCurrentPage("login");
    setActiveMenu("Beranda");
    setHomeView("utama");
    setSelectedOutlet(null);
    setSelectedPesanan(null);
    setPesananView("daftar");
    setDaftarPesanan([]);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
  };

  const isAuthenticated = !!token;

  const page =
    currentPage === "home" && !isAuthenticated
      ? "login"
      : currentPage;

  const renderHomeContent = () => {
    switch (activeMenu) {
      case "Beranda":
        if (userRole === "Mitra Laundry") {
          return (
            <DashboardMitra
              namaPengguna={user?.name || profile?.name || "Mitra"}
              namaOutlet={profile?.outletName || user?.outletName || "Bersih Laundry Mitra"}
              token={token}
              onLogout={handleLogout}
            />
          );
        }

        if (userRole === "Pelanggan") {
          if (homeView === "peta") {
            return (
              <PetaOutlet onBack={() => setHomeView("utama")} />
            );
          }

          return (
            <div className="relative">
              <BerandaPelanggan
                namaPelanggan={
                  profile?.name || user?.name || "Pelanggan"
                }
                onNavigateToDetail={handlePilihOutlet}
                onNavigateToMap={() => {
                  setSelectedOutlet(null);
                  setHomeView("peta");
                }}
              />

              {homeView === "detail-outlet" && selectedOutlet && (
                <DetailOutlet
                  key={selectedOutlet.id}
                  outlet={selectedOutlet}
                  token={token}
                  onBack={handleTutupOutlet}
                  onPesanSuccess={handleTambahPesanan}
                />
              )}
            </div>
          );
        }

        return (
          <div className="p-6 text-gray-600">
            Dashboard {userRole} belum tersedia.
          </div>
        );

      case "Pesanan":
        if (
          pesananView === "peta-pengiriman" &&
          selectedPesanan
        ) {
          return (
            <PetaPengiriman
              pesanan={selectedPesanan}
              onBack={() => setPesananView("detail")}
            />
          );
        }

        if (pesananView === "detail" && selectedPesanan) {
          return (
            <RincianPesanan
              pesanan={selectedPesanan}
              onBack={() => {
                setPesananView("daftar");
                setSelectedPesanan(null);
              }}
              onLacakPengiriman={() =>
                setPesananView("peta-pengiriman")
              }
            />
          );
        }

        return (
          <PesananSaya
            daftarPesanan={daftarPesanan}
            onSelectPesanan={(pesanan) => {
              setSelectedPesanan(pesanan);
              setPesananView("detail");
            }}
          />
        );

      case "Profil":
        return (
          <Profil
            token={token}
            user={user}
            profile={profile}
            onProfileUpdated={handleProfileUpdated}
            onLogout={handleLogout}
          />
        );

      default:
        return <div className="p-6">Halaman tidak ditemukan</div>;
    }
  };

  return (
    <>
      {page === "login" ? (
        <Login
          onNavigateToRegister={() => setCurrentPage("register")}
          onNavigateToForgotPassword={() =>
            setCurrentPage("forgot-password")
          }
          onLoginSuccess={handleLoginSuccess}
        />
      ) : page === "register" ? (
        <Register
          onNavigateToLogin={() => setCurrentPage("login")}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : page === "forgot-password" ? (
        <LupaKataSandi
          onNavigateToLogin={() => setCurrentPage("login")}
        />
      ) : page === "home" ? (
        <div className="min-h-screen bg-gray-50 flex">
          <Navigation
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
          <main className="w-full md:ml-64 pb-20 md:pb-0">
            {renderHomeContent()}
          </main>
        </div>
      ) : null}
    </>
  );
}

export default App;