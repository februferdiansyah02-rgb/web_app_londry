import React, { useState } from 'react';

export default function DetailOutlet({ onBack, onPesanSuccess }) {
  const [selectedService, setSelectedService] = useState('Cuci + Setrika');
  const [showNotif, setShowNotif] = useState(false);

  const services = [
    {
      id: 'Cuci + Setrika',
      nama: 'Cuci + Setrika',
      desc: 'Dicuci, dikeringkan, dan disetrika',
      harga: 'Rp8.000',
      waktu: '2 hari'
    },
    {
      id: 'Cuci Kering',
      nama: 'Cuci Kering',
      desc: 'Dicuci dan dikeringkan',
      harga: 'Rp6.000',
      waktu: '1 hari'
    },
    {
      id: 'Express 6 Jam',
      nama: 'Express 6 Jam',
      desc: 'Prioritas selesai di hari yang sama',
      harga: 'Rp14.000',
      waktu: '6 jam'
    }
  ];

  const handlePesan = () => {
    // Buat data pesanan baru
    const pesananBaru = {
      id: 'ML-' + Math.floor(100000 + Math.random() * 900000),
      namaOutlet: 'Bersih Laundry Setiabudi',
      layanan: selectedService,
      status: 'Sedang diproses',
      waktu: 'Hari ini, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimasi: 'Estimasi besok, 14.00'
    };

    if (onPesanSuccess) {
      onPesanSuccess(pesananBaru);
    }

    setShowNotif(true);
    setTimeout(() => {
      setShowNotif(false);
      if (onBack) onBack(); // Otomatis kembali setelah notifikasi muncul
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
      
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${
        showNotif ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
      }`}>
        <div className="bg-[#0B254D] text-white px-6 py-3 rounded-full shadow-2xl flex items-center text-sm font-bold border border-blue-900">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          Pesanan berhasil dibuat & masuk ke daftar pesanan!
        </div>
      </div>

      <div className="bg-white w-full h-[90vh] md:h-auto md:max-h-[85vh] md:max-w-md lg:max-w-lg rounded-t-[2rem] md:rounded-[2rem] flex flex-col relative overflow-hidden">
        
        <div className="relative h-48 w-full flex-shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Bersih Laundry Setiabudi" 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onBack}
            className="absolute top-6 left-5 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-[#0B254D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="absolute bottom-4 left-5 bg-white px-3 py-1.5 rounded-full flex items-center shadow-md">
            <svg className="w-4 h-4 text-green-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
            </svg>
            <span className="text-xs font-bold text-green-600">Terverifikasi</span>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto pb-28">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-[#0B254D] max-w-[70%]">Bersih Laundry Setiabudi</h1>
            <div className="flex items-center bg-[#FFF8E6] px-2 py-1 rounded-lg text-orange-500 font-bold text-sm">
              <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              4,9
            </div>
          </div>

          <div className="flex items-center text-gray-500 text-sm mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Jl. Dr. Setiabudi No. 156, Bandung
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="text-[11px] font-bold text-blue-500 tracking-wider mb-1 uppercase">Pilih Layanan</p>
            <h2 className="text-xl font-bold text-[#0B254D] mb-4">Layanan tersedia</h2>

            <div className="space-y-3">
              {services.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start ${
                    selectedService === service.id 
                      ? 'border-blue-500 bg-[#F4F8FF]' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="mt-1 mr-3 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedService === service.id ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedService === service.id && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-[#0B254D] text-[15px]">{service.nama}</h3>
                      <div className="text-right">
                        <span className="font-bold text-blue-600 text-[15px]">{service.harga}</span>
                        <span className="text-gray-400 text-xs font-normal">/kg</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{service.desc}</p>
                    <div className="flex items-center text-blue-500 text-xs font-semibold">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {service.waktu}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 px-6 flex justify-between items-center shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Pilihan Layanan</p>
            <p className="text-sm font-bold text-[#0B254D]">{selectedService}</p>
          </div>
          <button 
            onClick={handlePesan}
            className="bg-[#007AFF] hover:bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-colors active:scale-95"
          >
            Pesan sekarang
          </button>
        </div>

      </div>
    </div>
  );
}