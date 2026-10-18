import React, { useState } from 'react';
import Login from './pages/login';
import Register from './pages/registrasi';
import LupaKataSandi from './pages/lupa-kata-sandi';
import Navigation from './component/Navigation'; 
import BerandaPelanggan from './pages/pelanggan/beranda';
import DetailOutlet from './pages/pelanggan/DetailOutlet';
import RincianPesanan from './pages/pelanggan/RincianPesanan';
import PetaOutlet from './pages/pelanggan/petaoutlet';
import PetaPengiriman from './pages/pelanggan/PetaPengiriman';
import PesananSaya from './pages/pelanggan/pesananpelanggan';

const API_ROLE = { Pelanggan: 'customer', 'Mitra Laundry': 'outlet', Admin: 'admin' };
const DISPLAY_ROLE = { customer: 'Pelanggan', outlet: 'Mitra Laundry', admin: 'Admin' };

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('token') ? 'home' : 'login';
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('profile') || 'null');
    } catch {
      return null;
    }
  });
  const [activeMenu, setActiveMenu] = useState('Beranda');
  const [userRole, setUserRole] = useState(user ? DISPLAY_ROLE[user.role] || 'Pelanggan' : 'Pelanggan');
  const [homeView, setHomeView] = useState('utama');

  // State global untuk menyimpan daftar pesanan yang masuk
  const [daftarPesanan, setDaftarPesanan] = useState([
    {
      id: 'ML-240518',
      namaOutlet: 'Bersih Laundry Setiabudi',
      layanan: 'Cuci + Setrika',
      status: 'Sedang diproses',
      estimasi: 'Estimasi besok, 14.00',
      waktu: 'Hari ini, 08.30'
    }
  ]);
  const [selectedPesanan, setSelectedPesanan] = useState(null);
  const [pesananView, setPesananView] = useState('daftar');

  const handleTambahPesanan = (pesananBaru) => {
    setDaftarPesanan([pesananBaru, ...daftarPesanan]);
  };

  const handleLoginSuccess = ({ token: newToken, user: newUser, profile: newProfile }) => {
    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile ?? null);
    setUserRole(DISPLAY_ROLE[newUser.role] || 'Pelanggan');
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    if (newProfile) {
      localStorage.setItem('profile', JSON.stringify(newProfile));
    }
    setCurrentPage('home');
    setActiveMenu('Beranda');
    setHomeView('utama');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    setUserRole('Pelanggan');
    setCurrentPage('login');
    setActiveMenu('Beranda');
    setHomeView('utama');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
  };

  // Jika belum login, paksa halaman login (tidak bisa langsung ke home)
  const isAuthenticated = !!token;
  const page = (currentPage === 'home' && !isAuthenticated) ? 'login' : currentPage;

  const renderHomeContent = () => {
    switch (activeMenu) {
      case 'Beranda':
        if (userRole === 'Pelanggan') {
          if (homeView === 'peta') {
            return <PetaOutlet onBack={() => setHomeView('utama')} />;
          }
          return (
            <div className="relative">
              <BerandaPelanggan 
                onNavigateToDetail={() => setHomeView('detail-outlet')} 
                onNavigateToMap={() => setHomeView('peta')}
              />
              {homeView === 'detail-outlet' && (
                <DetailOutlet 
                  onBack={() => setHomeView('utama')} 
                  onPesanSuccess={handleTambahPesanan}
                />
              )}
            </div>
          );
        }
        break;
        
      case 'Pesanan':
        if (pesananView === 'peta-pengiriman' && selectedPesanan) {
          return (
            <PetaPengiriman
              pesanan={selectedPesanan}
              onBack={() => setPesananView('detail')}
            />
          );
        }
        if (pesananView === 'detail' && selectedPesanan) {
          return (
            <RincianPesanan
              pesanan={selectedPesanan}
              onBack={() => {
                setPesananView('daftar');
                setSelectedPesanan(null);
              }} 
              onLacakPengiriman={() => setPesananView('peta-pengiriman')}
            />
          );
        }
        return <PesananSaya daftarPesanan={daftarPesanan} onSelectPesanan={(p) => { setSelectedPesanan(p); setPesananView('detail'); }} />;
        
      case 'Profil':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Profil Pelanggan</h1>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800">{user ? user.name : 'Pengguna'}</h3>
              <p className="text-sm text-gray-500 mb-1">{user ? user.email : '-'}</p>
              {profile ? (
                <>
                  <p className="text-sm text-gray-600 mb-1"><strong>Alamat:</strong> {profile.alamat || '-'}</p>
                  <p className="text-sm text-gray-600 mb-4"><strong>Telepon:</strong> {profile.telepon || '-'}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500 mb-4">Belum ada data profil.</p>
              )}
              <button 
                onClick={handleLogout}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">
                Keluar (Logout)
              </button>
            </div>
          </div>
        );
        
      default:
        return <div>Halaman tidak ditemukan</div>;
    }
  };

  return (
    <>
      {page === 'login' ? (
        <Login 
          onNavigateToRegister={() => setCurrentPage('register')} 
          onNavigateToForgotPassword={() => setCurrentPage('forgot-password')} 
          onLoginSuccess={handleLoginSuccess}
        />
      ) : page === 'register' ? (
        <Register onNavigateToLogin={() => setCurrentPage('login')} />
      ) : page === 'forgot-password' ? (
        <LupaKataSandi onNavigateToLogin={() => setCurrentPage('login')} />
      ) : page === 'home' ? (
        <div className="min-h-screen bg-gray-50 flex">
          <Navigation activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          <main className="w-full md:ml-64 pb-20 md:pb-0">
            {renderHomeContent()}
          </main>
        </div>
      ) : null}
    </>
  );
}

export default App;
