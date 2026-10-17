import React, { useState } from 'react';

export default function Register({ onNavigateToLogin }) {

  const [activeTab, setActiveTab] = useState('Pelanggan');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">

        {/* Bagian Logo */}
        <div className="flex justify-center items-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-[14px] flex items-center justify-center mr-3 shadow-lg shadow-blue-200">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4z M4 8h16 M12 16a4 4 0 100-8 4 4 0 000 8z" />
             </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B254D] tracking-tight">
            <span className="text-blue-500">My</span>Laundry
          </h1>
        </div>

        {/* Card Register */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl w-full">

          {/* Tabs Navigasi Interaktif */}
          <div className="bg-gray-50 rounded-2xl p-1.5 flex justify-between items-center mb-6">
            <button 
              onClick={() => setActiveTab('Pelanggan')}
              className={`flex-1 py-2 rounded-xl text-sm transition-all ${
                activeTab === 'Pelanggan' 
                  ? 'bg-white text-blue-600 font-bold shadow-sm' 
                  : 'text-gray-500 font-semibold hover:text-gray-700'
              }`}>
              Pelanggan
            </button>
            
            <button 
              onClick={() => setActiveTab('Mitra Laundry')}
              className={`flex-1 py-2 rounded-xl text-sm transition-all ${
                activeTab === 'Mitra Laundry' 
                  ? 'bg-white text-blue-600 font-bold shadow-sm' 
                  : 'text-gray-500 font-semibold hover:text-gray-700'
              }`}>
              Mitra Laundry
            </button>
            
            <button 
              onClick={() => setActiveTab('Admin')}
              className={`flex-1 py-2 rounded-xl text-sm transition-all ${
                activeTab === 'Admin' 
                  ? 'bg-white text-blue-600 font-bold shadow-sm' 
                  : 'text-gray-500 font-semibold hover:text-gray-700'
              }`}>
              Admin
            </button>
          </div>

          <div className="border-b border-gray-100 mb-6"></div>

          {/* Form Register */}
          <form onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Daftar sebagai {activeTab}
            </h2>

            {/* Input Nama Lengkap (Sesuai Gambar) */}
            <div className="mb-4">
              <label htmlFor="nama" className="block text-[13px] font-bold text-[#334155] mb-2">Nama lengkap</label>
              <input type="text" id="nama" placeholder="Nama lengkap" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400" />
            </div>

            {/* Input Email (Sesuai Gambar) */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-[13px] font-bold text-[#334155] mb-2">Email</label>
              <input type="email" id="email" placeholder="nama@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400" />
            </div>

            {/* Input Kata Sandi (Sesuai Gambar) */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-[13px] font-bold text-[#334155] mb-2">Kata sandi</label>
              <input type="password" id="password" placeholder="Kata sandi" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400" />
            </div>

            {/* Input Konfirmasi Kata Sandi (Tambahan Khusus) */}
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-[13px] font-bold text-[#334155] mb-2">Konfirmasi kata sandi</label>
              <input type="password" id="confirm-password" placeholder="Ulangi kata sandi" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400" />
            </div>

            <button type="submit" className="w-full bg-[#007AFF] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition duration-200 mb-6 shadow-md shadow-blue-200/50 text-[15px]">
              Daftar
            </button>

          </form>

          {/* Link Masuk */}
          <p className="text-center text-xs text-gray-500">
            Sudah punya akun?{' '}
            <button 
              onClick={onNavigateToLogin} 
              className="font-bold text-[#007AFF] hover:text-blue-700 transition-colors"
            >
              Masuk
            </button>
          </p>
          
        </div>
      </div>
    </div>
  );
}