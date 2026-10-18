import React, { useState } from 'react';

const STATUS_FLOW = [
  { label: 'Pesanan Dibuat', waktu: 'Baru saja' },
  { label: 'Dikonfirmasi Outlet', waktu: 'Baru saja' },
  { label: 'Dicuci & Dikeringkan', waktu: 'Sedang berlangsung' },
  { label: 'Selesai Siap Diambil', waktu: 'Belum' },
  { label: 'Diambil', waktu: 'Belum' },
];

export default function RincianPesanan({ pesanan, onBack, onLacakPengiriman }) {
  const statusIndex = STATUS_FLOW.findIndex((s) => s.label === pesanan.status) + 1;

  // State untuk Modal Chat
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'kurir', text: 'Halo Kak, saya kurir yang bertugas mengantar cucian Anda.', time: '10:00' },
    { sender: 'kurir', text: 'Pesanan sedang diproses ya Kak.', time: '10:01' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Data Simulasi Kurir (Mirip ShopeeFood)
  const kurir = pesanan.kurir || {
    nama: 'Ahmad Fauzi',
    hp: '081234567890',
    platNomor: 'D 4567 ABC',
    foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: '4.9',
  };

  const tampilkanKurir = pesanan.status !== 'Pesanan Dibuat' && pesanan.status !== 'Dikonfirmasi Outlet';

  // Fungsi Kirim Pesan
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Simulasi balasan otomatis dari kurir setelah 1 detik
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'kurir',
          text: 'Baik Kak, pesan sudah diterima. Segera saya kabari jika sudah jalan ya!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] font-sans pb-24">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-[#0B254D] hover:bg-gray-50 transition-colors mr-3 shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0B254D]">Rincian Pesanan</h1>
      </div>

      {/* Konten Utama - Responsif untuk Mobile & Desktop/Windows */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* KARTU INFO KURIR (Ala ShopeeFood) */}
        {tampilkanKurir && (
          <div className="bg-white rounded-[20px] p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {/* Foto Kurir & Rating */}
              <div className="relative">
                <img
                  src={kurir.foto}
                  alt={kurir.nama}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
                  ★ {kurir.rating}
                </span>
              </div>
              
              {/* Nama & Plat Nomor */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Kurir Pengiriman</p>
                <h3 className="font-bold text-[#0B254D] text-sm sm:text-base">{kurir.nama}</h3>
                <p className="text-xs text-gray-500 font-medium">{kurir.platNomor}</p>
              </div>
            </div>

            {/* Tombol Hubungi (Chat & Telepon Cepat) */}
            <div className="flex items-center gap-2">
              {/* Tombol Chat */}
              <button
                onClick={() => setIsOpenChat(true)}
                className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm relative"
                title="Chat Kurir"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Tombol Telepon */}
              <a
                href={`tel:${kurir.hp}`}
                className="w-10 h-10 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center justify-center hover:bg-green-100 transition-colors shadow-sm"
                title="Telepon Kurir"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Kartu Utama */}
        <div className="bg-white rounded-[20px] p-5 sm:p-8 shadow-sm border border-gray-100">
          
          {/* Header Kartu */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] font-bold text-blue-500 tracking-wider uppercase">Pesanan #{pesanan.id}</p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B254D]">{pesanan.namaOutlet}</h2>
            </div>
            <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold ${
              pesanan.status === 'Selesai Siap Diambil' || pesanan.status === 'Diambil'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : pesanan.status === 'Dicuci & Dikeringkan'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-[#EAF2FE] text-blue-600 border border-blue-100'
            } border`}>
              {pesanan.status}
            </span>
          </div>

          <div className="flex items-center text-gray-400 text-xs mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {pesanan.waktu || 'Hari ini'}
          </div>

          {/* Grid Layout untuk Layar Besar & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Kolom Kiri: Timeline Status */}
            <div className="relative">
              <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200" />
              {STATUS_FLOW.map((status, i) => {
                const isActive = i < statusIndex;
                const isCurrent = i === statusIndex - 1;
                return (
                  <div key={status.label} className="flex items-center mb-4 relative z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? isCurrent
                          ? 'bg-blue-600 border-2 border-white shadow-md'
                          : 'bg-green-100 text-green-600 border-2 border-green-400'
                        : 'bg-white border-2 border-gray-300'
                    }`}>
                      {isActive ? (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">{i + 1}</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-bold ${isActive ? 'text-[#0B254D]' : 'text-gray-400'}`}>
                        {status.label}
                      </p>
                      <p className={`text-[11px] ${isActive ? 'text-gray-600' : 'text-gray-300'}`}>
                        {isCurrent ? 'Sedang berlangsung' : isActive ? 'Selesai' : status.waktu}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Kolom Kanan: Detail & Pesan Selesai */}
            <div className="space-y-4">
              {/* Pesan selesai saat pesanan sudah sampai */}
              {(pesanan.status === 'Selesai Siap Diambil' || pesanan.status === 'Diambil') && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-green-600 mt-0.5 shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 text-sm">
                        Pesanan telah sampai! {pesanan.status === 'Diambil' ? '✅' : '🎉'}
                      </h3>
                      <p className="text-green-700 text-xs mt-0.5">
                        {pesanan.status === 'Diambil'
                          ? 'Terima kasih sudah menggunakan layanan kami.'
                          : 'Silakan segera ambil pesanan cuciamu di outlet terdekat.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ringkasan Pesanan */}
              <div className="p-4 rounded-xl bg-[#F4F8FF] border border-blue-100">
                <p className="text-[11px] font-bold text-blue-500 tracking-wider uppercase mb-2">Ringkasan Pesanan</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-[11px] font-bold uppercase">Layanan</p>
                    <p className="font-bold text-[#0B254D]">{pesanan.layanan}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[11px] font-bold uppercase">Estimasi</p>
                    <p className="font-bold text-blue-600">{pesanan.estimasi}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
                  <span className="font-bold text-[#0B254D] text-lg">{pesanan.total || 'Rp 0'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Outlet</p>
                  <p className="text-sm text-gray-700">{pesanan.namaOutlet}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Metode pembayaran</p>
                  <p className="text-sm text-gray-700">{pesanan.metodePembayaran || 'Tunai saat diambil'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button className="w-full bg-[#007AFF] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-200/50 transition-colors active:scale-95">
            Langsung ke outlet
          </button>
          
          {pesanan.status !== 'Diambil' && onLacakPengiriman && (
            <button
              onClick={onLacakPengiriman}
              className="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl border border-blue-100 hover:bg-blue-100 flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Lacak Pengiriman di Peta
            </button>
          )}

          <button
            onClick={onBack}
            className="w-full bg-white hover:bg-gray-50 text-[#0B254D] font-bold py-3.5 rounded-xl border border-gray-200 shadow-sm transition-colors active:scale-95"
          >
            Kembali ke daftar pesanan
          </button>
        </div>

      </div>

      {/* MODAL POPUP CHAT */}
      {isOpenChat && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-2xl h-[80vh] sm:h-[500px] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
            
            {/* Header Chat */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={kurir.foto} alt={kurir.nama} className="w-10 h-10 rounded-full object-cover border" />
                <div>
                  <h3 className="font-bold text-[#0B254D] text-sm">{kurir.nama}</h3>
                  <p className="text-[10px] text-green-600 font-medium">● Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenChat(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Ruang Pesan Chat */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FBFF]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#007AFF] text-white rounded-br-none'
                        : 'bg-white text-[#0B254D] border border-gray-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input Pesan Chat */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tulis pesan ke kurir..."
                className="flex-1 bg-gray-100 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                type="submit"
                className="bg-[#007AFF] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow hover:bg-blue-600 transition-colors"
              >
                Kirim
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}