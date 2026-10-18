import React, { useState } from 'react';

export default function pesananpelanggan({ daftarPesanan, onSelectPesanan }) {
  const [activeTab, setActiveTab] = useState('Aktif');

  return (
    <div className="p-5 font-sans bg-[#F8FBFF] min-h-screen pb-24">
      {/* Konten dibatasi lebarnya agar ukuran kartu pesanan konsisten
          antara mobile dan layar laptop/web (tidak meregang lebar penuh di desktop) */}
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
        <p className="text-[11px] font-bold text-blue-500 tracking-wider mb-1 uppercase">Aktivitas</p>
        <h1 className="text-3xl font-extrabold text-[#0B254D]">Pesanan saya</h1>
      </div>

      <div className="flex bg-[#EAF2FE] p-1.5 rounded-2xl mb-6">
        <button 
          onClick={() => setActiveTab('Aktif')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${
            activeTab === 'Aktif' ? 'bg-white text-[#0B254D] shadow-sm' : 'text-gray-500'
          }`}
        >
          Aktif <span className="ml-1.5 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{daftarPesanan.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('Riwayat')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'Riwayat' ? 'bg-white text-[#0B254D] shadow-sm' : 'text-gray-500'
          }`}
        >
          Riwayat
        </button>
      </div>

      {activeTab === 'Aktif' ? (
        <div>
          {daftarPesanan.length === 0 ? (
            <div className="bg-white rounded-[20px] p-10 text-center shadow-sm border border-gray-100 mt-10">
              <h3 className="font-bold text-[#0B254D] text-base mb-1">Belum ada pesanan aktif</h3>
              <p className="text-xs text-gray-400">Yuk, pesan layanan laundry dari beranda!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {daftarPesanan.map((pesanan) => (
                <div
                  key={pesanan.id}
                  onClick={() => onSelectPesanan?.(pesanan)}
                  className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 font-bold">
                        🧺
                      </div>
                      <div>
                        <span className="inline-block bg-[#EAF2FE] text-blue-600 font-bold text-[10px] px-2.5 py-1 rounded-full mb-1">
                          {pesanan.status}
                        </span>
                        <h3 className="font-bold text-[#0B254D] text-base">{pesanan.namaOutlet}</h3>
                        <p className="text-xs text-gray-400">Pesanan #{pesanan.id} • {pesanan.layanan}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 mb-3">
                    <div className="h-1.5 bg-blue-600 rounded-full"></div>
                    <div className="h-1.5 bg-blue-600 rounded-full"></div>
                    <div className="h-1.5 bg-blue-600 rounded-full"></div>
                    <div className="h-1.5 bg-gray-200 rounded-full"></div>
                    <div className="h-1.5 bg-gray-200 rounded-full"></div>
                  </div>

                  <div className="flex justify-between items-center text-xs mb-4">
                    <span className="text-gray-500">Dicuci & dikeringkan</span>
                    <span className="font-bold text-[#0B254D]">{pesanan.estimasi}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[20px] p-8 text-center text-gray-400">
          Belum ada riwayat pesanan.
        </div>
      )}
      </div>
    </div>
  );
}