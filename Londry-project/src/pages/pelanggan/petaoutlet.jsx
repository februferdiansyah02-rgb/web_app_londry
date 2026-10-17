import React from 'react';

export default function PetaOutlet({ onBack, lokasi = 'Jakarta' }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 md:pb-0">
      <div className="bg-white p-4 flex items-center shadow-sm z-10 sticky top-0">
        <button 
          onClick={onBack} 
          className="mr-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-lg font-bold text-[#0B254D]">Outlet di {lokasi}</h1>
      </div>

      <div className="flex-1 w-full relative bg-gray-200 h-[80vh] md:h-full">
        {/* Tautan src diubah menggunakan versi Embed khusus untuk wilayah Jakarta */}
        <iframe 
          title="Peta Laundry"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.4811253984!2d106.68942940250616!3d-6.229746468694038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <h3 className="font-bold text-[#0B254D]">Outlet terdekat di {lokasi}</h3>
          <p className="text-xs text-gray-500 mb-3">1,2 km • Jl. Sudirman, Jakarta</p>
          <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-sm transition-colors hover:bg-blue-700">
            Pesan di sini
          </button>
        </div>
      </div>
    </div>
  );
}