import React from 'react';

export default function PetaPengiriman({ pesanan, onBack }) {
  const STATUS_STEPS = [
    { label: 'Diterima', desc: 'Pesanan diterima & diproses' },
    { label: 'Dicuci', desc: 'Cucian dicuci & dikeringkan' },
    { label: 'Dikirim', desc: 'Kurir di perjalanan' },
    { label: 'Sampai', desc: 'Tiba di lokasi' },
  ];

  const progressByStatus = {
    'Sedang diproses': 15,
    'Dikonfirmasi Outlet': 25,
    'Dicuci & Dikeringkan': 65,
    'Selesai Siap Diambil': 100,
    'Diambil': 100,
  };

  const progress = progressByStatus[pesanan.status] ?? 0;
  const sudahSampai = progress >= 100;

  // Koordinat simulasi (area Bandung)
  const outlet = { lat: -6.903444, lng: 107.573117 };
  const pelanggan = { lat: -6.9175, lng: 107.61 };
  const midLat = (outlet.lat + pelanggan.lat) / 2;
  const midLng = (outlet.lng + pelanggan.lng) / 2;

  const mapsSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15000!2d${midLng}!3d${midLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6d5a8c5a5a5%3A0xabcdef123456789!2sRute+Pengiriman+${encodeURIComponent(pesanan.namaOutlet)}!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid`;

  const getStatusText = () => {
    if (sudahSampai) return 'Pesananmu telah sampai di lokasi tujuan.';
    if (progress >= 65) return 'Kurir sedang dalam perjalanan ke lokasi kamu.';
    if (progress > 0) return 'Pesanan sedang diproses di outlet.';
    return 'Pesanan baru diterima outlet.';
  };

  // Posisi marker kurir di atas peta
  const courierLeft = `${30 + (progress / 100) * 40}%`;
  const courierTop = `${35 + (progress / 100) * 35}%`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-sans">
      
      {/* Container Popup / Modal */}
      <div className="bg-[#F8FBFF] w-full max-w-lg rounded-t-[28px] sm:rounded-[24px] max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        
        {/* Header Popup */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#0B254D]">Lacak Pengiriman</h1>
              <p className="text-[11px] text-gray-400">Pesanan #{pesanan.id} &bull; {pesanan.namaOutlet}</p>
            </div>
          </div>
          
          {/* Tombol Tutup (Close) */}
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Konten Popup */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Peta Interaktif */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 relative overflow-hidden aspect-[16/9] w-full">
            <iframe
              title="Peta Pengiriman"
              src={mapsSrc}
              className="absolute inset-0 w-full h-full border-0 rounded-xl"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Marker Posisi Kurir */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="absolute w-7 h-7 rounded-full bg-white shadow-lg border-2 transition-all duration-500 flex items-center justify-center"
                style={{
                  left: courierLeft,
                  top: courierTop,
                  borderColor: sudahSampai ? '#16a34a' : '#2563eb',
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: sudahSampai ? '#16a34a' : '#2563eb' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Info Status Pengiriman */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status Saat Ini</p>
              <p className={`text-sm font-bold ${sudahSampai ? 'text-green-600' : 'text-[#0B254D]'}`}>
                {getStatusText()}
              </p>
            </div>

            {/* Stepper Ringkas */}
            <div className="relative pt-4 pb-2">
              <div className="absolute left-4 right-4 top-8 h-0.5 bg-gray-200" />
              <div
                className="absolute left-4 top-8 h-0.5 bg-green-500 transition-all duration-600"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
              <div className="grid grid-cols-4 relative z-10 text-center">
                {STATUS_STEPS.map((step, i) => {
                  const active = progress >= (i === 0 ? 0 : i === 1 ? 25 : i === 2 ? 65 : 100);
                  return (
                    <div key={step.label} className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold transition-all ${
                        active ? 'bg-green-500 text-white border-green-500 shadow-sm' : 'bg-white text-gray-400 border-gray-300'
                      }`}>
                        {active ? '✓' : i + 1}
                      </div>
                      <span className={`text-[10px] font-bold mt-1 leading-tight ${active ? 'text-green-700' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail Lokasi Asal & Tujuan */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                <p className="text-[9px] font-bold text-blue-600 uppercase">Dari Outlet</p>
                <p className="text-xs text-gray-700 font-medium truncate">{pesanan.namaOutlet}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-green-50/50 border border-green-100">
                <p className="text-[9px] font-bold text-green-600 uppercase">Tujuan</p>
                <p className="text-xs text-gray-700 font-medium">Lokasi Anda</p>
              </div>
            </div>
          </div>

          {/* Notifikasi Jika Sudah Sampai */}
          {sudahSampai && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-green-800 text-xs sm:text-sm">Pesanan telah sampai! 🎉</h3>
                <p className="text-green-700 text-xs">Silakan periksa dan ambil cucianmu.</p>
              </div>
            </div>
          )}

          {/* Tombol Aksi Tutup Popup */}
          <button
            onClick={onBack}
            className="w-full bg-[#007AFF] hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-200/50 transition-colors active:scale-95 text-sm"
          >
            Tutup & Kembali
          </button>

        </div>
      </div>
    </div>
  );
}