import React from 'react';

// Sekarang Navigation menerima props: activeMenu dan setActiveMenu
export default function Navigation({ activeMenu, setActiveMenu }) {
  return (
    <nav className="fixed z-50 bg-white border-gray-200 
                    bottom-0 left-0 w-full flex flex-row justify-around py-2 px-2 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
                    md:top-0 md:h-screen md:w-64 md:flex-col md:justify-start md:border-t-0 md:border-r md:px-4 md:py-6 md:shadow-none">

      <div className="hidden md:flex items-center mb-10 px-4">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4z M4 8h16 M12 16a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </div>
        <span className="text-xl font-extrabold text-[#0B254D]">My<span className="text-blue-500">Laundry</span></span>
      </div>

      {/* Tombol Beranda */}
      <button
        onClick={() => setActiveMenu('Beranda')}
        className={`flex flex-col md:flex-row items-center md:justify-start py-2 md:py-3 md:px-4 md:mb-2 rounded-xl transition-all ${
          activeMenu === 'Beranda' ? 'text-blue-500 md:bg-blue-50' : 'text-gray-400 hover:text-gray-600 md:hover:bg-gray-50'
        }`}
      >
        <svg className="w-6 h-6 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span className="text-[11px] md:text-sm font-semibold mt-1 md:mt-0">Beranda</span>
      </button>

      {/* Tombol Pesanan */}
      <button
        onClick={() => setActiveMenu('Pesanan')}
        className={`flex flex-col md:flex-row items-center md:justify-start py-2 md:py-3 md:px-4 md:mb-2 rounded-xl transition-all ${
          activeMenu === 'Pesanan' ? 'text-blue-500 md:bg-blue-50' : 'text-gray-400 hover:text-gray-600 md:hover:bg-gray-50'
        }`}
      >
        <div className="relative">
          <svg className="w-6 h-6 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span className="absolute top-0 -right-1 md:right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </div>
        <span className="text-[11px] md:text-sm font-semibold mt-1 md:mt-0">Pesanan</span>
      </button>

      {/* Tombol Profil */}
      <button
        onClick={() => setActiveMenu('Profil')}
        className={`flex flex-col md:flex-row items-center md:justify-start py-2 md:py-3 md:px-4 md:mb-2 rounded-xl transition-all ${
          activeMenu === 'Profil' ? 'text-blue-500 md:bg-blue-50' : 'text-gray-400 hover:text-gray-600 md:hover:bg-gray-50'
        }`}
      >
        <svg className="w-6 h-6 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <span className="text-[11px] md:text-sm font-semibold mt-1 md:mt-0">Profil</span>
      </button>

    </nav>
  );
}