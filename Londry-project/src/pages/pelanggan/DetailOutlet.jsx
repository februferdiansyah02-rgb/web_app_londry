import React, { useEffect, useRef, useState } from "react";

export default function DetailOutlet({
  outlet,
  token,
  onBack,
  onPesanSuccess,
}) {
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const timerRef = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!outlet) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6">
          <p className="font-semibold text-gray-800">
            Data outlet belum diterima.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Tutup popup dan pilih outlet kembali.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-white"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  // Pertahankan tiga layanan Setiabudi yang sudah ada.
  // Outlet lain menggunakan layanan dan harga dari kartu Beranda.
  const services =
    outlet.id === 1
      ? [
          {
            id: "cuci-setrika",
            nama: outlet.layanan,
            desc: "Dicuci, dikeringkan, dan disetrika",
            harga: outlet.harga,
            waktu: outlet.estimasi,
            satuan: outlet.satuan,
          },
          {
            id: "cuci-kering",
            nama: "Cuci Kering",
            desc: "Dicuci dan dikeringkan",
            harga: "Rp6.000",
            waktu: "1 hari",
            satuan: "/kg",
          },
          {
            id: "express-6-jam",
            nama: "Express 6 Jam",
            desc: "Prioritas selesai di hari yang sama",
            harga: "Rp14.000",
            waktu: "6 jam",
            satuan: "/kg",
          },
        ]
      : [
          {
            id: `${outlet.id}-utama`,
            nama: outlet.layanan,
            desc: `Layanan ${outlet.layanan} dari ${outlet.nama}`,
            harga: outlet.harga,
            waktu: outlet.estimasi,
            satuan: outlet.satuan,
          },
        ];

  const selectedService =
    services.find((service) => service.id === selectedServiceId) ||
    services[0];

  const isClosed = outlet.status === "Tutup";

  const handlePesan = () => {
    if (
      isClosed ||
      submittingRef.current ||
      typeof onPesanSuccess !== "function"
    ) {
      return;
    }

    submittingRef.current = true;

    const now = new Date();

    // Konversi harga string (contoh "Rp8.000") ke angka untuk totalHarga
    const parseHarga = (h) => {
      if (!h) return 0;
      const angka = String(h).replace(/[^0-9]/g, "");
      return angka ? parseInt(angka, 10) : 0;
    };

    const totalHarga = parseHarga(selectedService.harga);

    const pesananBaru = {
      id: `ML-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      outletId: outlet.id,
      namaOutlet: outlet.nama,
      alamatOutlet: outlet.alamat,
      fotoOutlet: outlet.image,
      layanan: selectedService.nama,
      harga: selectedService.harga,
      satuan: selectedService.satuan,
      berat: 1,
      totalHarga,
      status: "Menunggu konfirmasi",
      waktu: `Hari ini, ${now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      estimasi: `Estimasi pengerjaan: ${selectedService.waktu}`,
    };

    onPesanSuccess(pesananBaru);
    setShowNotif(true);

    timerRef.current = setTimeout(() => {
      onBack?.();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
      {showNotif && (
        <div
          role="status"
          className="fixed top-10 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-md"
        >
          <div className="bg-[#0B254D] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-center">
            Pesanan demo ditambahkan ke daftar pesanan!
          </div>
        </div>
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="outlet-title"
        className="bg-white w-full h-[90vh] md:h-auto md:max-h-[85vh] md:max-w-md lg:max-w-lg rounded-t-[2rem] md:rounded-[2rem] flex flex-col relative overflow-hidden"
      >
        <div className="relative h-48 w-full flex-shrink-0">
          <img
            src={outlet.image}
            alt={outlet.nama}
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={onBack}
            aria-label="Tutup detail outlet"
            className="absolute top-6 left-5 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md hover:bg-gray-50"
          >
            <svg
              className="w-5 h-5 text-[#0B254D]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="absolute bottom-4 left-5 bg-white px-3 py-1.5 rounded-full shadow-md">
            <span
              className={`text-xs font-bold ${
                isClosed ? "text-red-600" : "text-green-600"
              }`}
            >
              {outlet.status}
            </span>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto min-h-0">
          <div className="flex justify-between items-start gap-3 mb-4">
            <h1
              id="outlet-title"
              className="text-2xl font-bold text-[#0B254D]"
            >
              {outlet.nama}
            </h1>

            <div className="shrink-0 bg-[#FFF8E6] px-2 py-1 rounded-lg text-orange-500 font-bold text-sm">
              ★ {outlet.rating}
            </div>
          </div>

          <p className="text-gray-500 text-sm mb-2">
            {outlet.alamat}
          </p>

          <p className="text-gray-400 text-xs mb-5">
            Jarak: {outlet.jarak}
          </p>

          {isClosed && (
            <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              Outlet sedang tutup. Pemesanan belum tersedia.
            </p>
          )}

          <div className="border-t border-gray-100 pt-6">
            <p className="text-[11px] font-bold text-blue-500 tracking-wider mb-1 uppercase">
              Pilih Layanan
            </p>

            <h2 className="text-xl font-bold text-[#0B254D] mb-4">
              Layanan tersedia
            </h2>

            <div className="space-y-3">
              {services.map((service) => {
                const isSelected =
                  selectedService.id === service.id;

                return (
                  <label
                    key={service.id}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-start ${
                      isSelected
                        ? "border-blue-500 bg-[#F4F8FF]"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    } ${
                      showNotif || isClosed
                        ? "opacity-60"
                        : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="outlet-service"
                      value={service.id}
                      checked={isSelected}
                      onChange={() =>
                        setSelectedServiceId(service.id)
                      }
                      disabled={showNotif || isClosed}
                      className="mt-1 mr-3 h-5 w-5 shrink-0 accent-blue-600"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-3 mb-1">
                        <h3 className="font-bold text-[#0B254D] text-[15px]">
                          {service.nama}
                        </h3>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-blue-600 text-[15px]">
                            {service.harga}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {service.satuan}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mb-2">
                        {service.desc}
                      </p>

                      <p className="text-blue-500 text-xs font-semibold">
                        Estimasi: {service.waktu}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="shrink-0 bg-white border-t border-gray-100 p-4 px-6 flex justify-between items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">
              Pilihan Layanan
            </p>

            <p className="text-sm font-bold text-[#0B254D]">
              {selectedService.nama}
            </p>

            <p className="text-xs text-blue-600 mt-1">
              {selectedService.harga}
              {selectedService.satuan}
            </p>
          </div>

          <button
            type="button"
            onClick={handlePesan}
            disabled={
              isClosed ||
              showNotif ||
              typeof onPesanSuccess !== "function"
            }
            className="shrink-0 bg-[#007AFF] hover:bg-blue-600 text-white font-bold py-3 px-5 rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClosed
              ? "Outlet tutup"
              : showNotif
              ? "Ditambahkan"
              : "Pesan sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}