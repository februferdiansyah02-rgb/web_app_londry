import React, { useState } from 'react';
import Login from './pages/login';
import Register from './pages/registrasi';
import LupaKataSandi from './pages/lupa-kata-sandi';
import Navigation from './component/Navigation'; 
import BerandaPelanggan from './pages/pelanggan/beranda';
import DetailOutlet from './pages/pelanggan/DetailOutlet';
import PetaOutlet from './pages/pelanggan/petaoutlet';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [activeMenu, setActiveMenu] = useState('Beranda');
  const [userRole, setUserRole] = useState('Pelanggan'); 
  const [homeView, setHomeView] = useState('utama');

  const renderHomeContent = () => {
    switch (activeMenu) {
      case 'Beranda':
        if (userRole === 'Pelanggan') {
          if (homeView === 'peta') {
            return (
              <PetaOutlet 
                onBack={() => setHomeView('utama')} 
              />
            );
          }
          return (
            <div className="relative">
              <BerandaPelanggan 
                onNavigateToDetail={() => setHomeView('detail-outlet')} 
                onNavigateToMap={() => setHomeView('peta')}
              />
              {homeView === 'detail-outlet' && (
                <DetailOutlet onBack={() => setHomeView('utama')} />
              )}
            </div>
          );
        } else if (userRole === 'Mitra Laundry') {
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold">Dasbor Mitra Laundry</h1>
              <p>Halaman khusus mitra akan dibuat di sini.</p>
            </div>
          );
        } else if (userRole === 'Admin') {
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold">Panel Admin Pusat</h1>
              <p>Halaman khusus admin akan dibuat di sini.</p>
            </div>
          );
        }
        break;
        
      case 'Pesanan':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Daftar Pesanan Anda</h1>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 border-l-4 border-l-blue-500">
              <h3 className="font-bold">Pesanan #10294 (Sedang Dicuci)</h3>
              <p className="text-sm text-gray-500">Cuci Kering + Setrika - 3 Kg</p>
            </div>
          </div>
        );
        
      case 'Profil':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Profil Pengguna</h1>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold">Febru Ferdiansyah</h3>
              <p className="text-sm text-gray-500 mb-4">febru@email.com</p>
              <button 
                onClick={() => {
                  setCurrentPage('login');
                  setHomeView('utama');
                  setActiveMenu('Beranda');
                }} 
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
      {currentPage === 'login' ? (
        <Login 
          onNavigateToRegister={() => setCurrentPage('register')} 
          onNavigateToForgotPassword={() => setCurrentPage('forgot-password')} 
          onLoginSuccess={(role) => {
            setUserRole(role || 'Pelanggan');
            setCurrentPage('home');
          }}
        />
      ) : currentPage === 'register' ? (
        <Register onNavigateToLogin={() => setCurrentPage('login')} />
      ) : currentPage === 'forgot-password' ? (
        <LupaKataSandi onNavigateToLogin={() => setCurrentPage('login')} />
      ) : currentPage === 'home' ? (
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