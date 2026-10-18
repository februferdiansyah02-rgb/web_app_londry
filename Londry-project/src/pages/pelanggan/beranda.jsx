import React, { useState, useMemo, useEffect } from "react";

export default function Beranda({
  onNavigateToDetail,
  onNavigateToMap,
  lokasiSaatIni,
  onUbahLokasi,
  namaPelanggan = "Pelanggan",
}) {
  const [activeFilter, setActiveFilter] = useState("Terdekat");
  const [searchQuery, setSearchQuery] = useState("");
  const [waktu, setWaktu] = useState(() => new Date());

  const [lokasiLokal, setLokasiLokal] = useState("");
  const lokasiTampil = lokasiSaatIni || lokasiLokal || "Pilih lokasi";

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [lokasiInput, setLokasiInput] = useState(lokasiSaatIni || "");

  // Perbarui sapaan selama halaman terbuka.
  useEffect(() => {
    const updateWaktu = () => setWaktu(new Date());

    const interval = setInterval(updateWaktu, 1000);
    window.addEventListener("focus", updateWaktu);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", updateWaktu);
    };
  }, []);

  const jam = waktu.getHours();

  const sapaan =
    jam >= 4 && jam < 11
      ? "Selamat pagi"
      : jam >= 11 && jam < 15
      ? "Selamat siang"
      : jam >= 15 && jam < 18
      ? "Selamat sore"
      : "Selamat malam";

  const filterOptions = [
    "Terdekat",
    "Rating tertinggi",
    "Harga rendah",
  ];

  const lokasiPilihan = [
    { nama: "Setiabudi, Bandung", coords: "-6.903444,107.573117" },
    { nama: "Dago, Bandung", coords: "-6.895087,107.610617" },
    { nama: "Cibaduyut, Bandung", coords: "-6.943828,107.618136" },
    { nama: "Antapani, Bandung", coords: "-6.928120,107.682242" },
    { nama: "Kopo, Bandung", coords: "-6.959744,107.617481" },
    { nama: "Cicaheum, Bandung", coords: "-6.911268,107.652720" },
  ];

  const outlets = useMemo(
    () => [
      {
        id: 1,
        nama: "Bersih Laundry Setiabudi",
        rating: "4,9",
        jarak: "0,8 km",
        alamat: "Jl. Dr. Setiabudi, Bandung",
        layanan: "Cuci + Setrika",
        harga: "Rp8.000",
        satuan: "/kg",
        estimasi: "2 hari",
        status: "Buka",
        image:
          "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        nama: "Cuci Cepat Dago",
        rating: "4,8",
        jarak: "1,2 km",
        alamat: "Jl. Dago, Bandung",
        layanan: "Express 24 Jam",
        harga: "Rp10.000",
        satuan: "/kg",
        estimasi: "Sama hari",
        status: "Buka",
        image:
          "https://images.unsplash.com/photo-1559287747-176d73e84074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        nama: "Laundryku Cibaduyut",
        rating: "4,7",
        jarak: "1,5 km",
        alamat: "Jl. Cibaduyut, Bandung",
        layanan: "Cuci Kiloan",
        harga: "Rp7.000",
        satuan: "/kg",
        estimasi: "2 hari",
        status: "Buka",
        image:
          "https://images.unsplash.com/photo-1584265769072-e881033a2a73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 4,
        nama: "Mulia Laundry Antapani",
        rating: "4,6",
        jarak: "2,0 km",
        alamat: "Jl. Antapani, Bandung",
        layanan: "Cuci Satuan",
        harga: "Rp12.000",
        satuan: "/item",
        estimasi: "3 hari",
        status: "Buka",
        image:
          "https://images.unsplash.com/photo-1522646871361-c27924d9f17f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 5,
        nama: "Fresh Clean Kopo",
        rating: "4,9",
        jarak: "2,3 km",
        alamat: "Jl. Kopo, Bandung",
        layanan: "Cuci + Setrika",
        harga: "Rp8.500",
        satuan: "/kg",
        estimasi: "2 hari",
        status: "Tutup",
        image:
          "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 6,
        nama: "King Laundry Cicaheum",
        rating: "4,5",
        jarak: "2,8 km",
        alamat: "Jl. Cicaheum, Bandung",
        layanan: "Express 24 Jam",
        harga: "Rp11.000",
        satuan: "/kg",
        estimasi: "Sama hari",
        status: "Buka",
        image:
          "https://images.unsplash.com/photo-1559287747-176d73e84074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
    []
  );

  const maxRating = useMemo(
    () =>
      Math.max(
        ...outlets.map((outlet) =>
          parseFloat(outlet.rating.replace(",", "."))
        )
      ),
    [outlets]
  );

  const minHarga = useMemo(
    () =>
      Math.min(
        ...outlets.map((outlet) =>
          parseInt(outlet.harga.replace(/[^0-9]/g, ""), 10)
        )
      ),
    [outlets]
  );

  const sortedOutlets = useMemo(() => {
    const data = outlets.map((outlet) => ({
      ...outlet,
      ratingVal: parseFloat(outlet.rating.replace(",", ".")),
      hargaVal: parseInt(outlet.harga.replace(/[^0-9]/g, ""), 10),
      jarakVal: parseFloat(outlet.jarak.replace(",", ".")),
    }));

    return data.sort((a, b) => {
      if (activeFilter === "Terdekat") {
        return a.jarakVal - b.jarakVal;
      }

      if (activeFilter === "Rating tertinggi") {
        return b.ratingVal - a.ratingVal;
      }

      if (activeFilter === "Harga rendah") {
        return a.hargaVal - b.hargaVal;
      }

      return 0;
    });
  }, [activeFilter, outlets]);

  const handleLocationClick = () => {
    setLokasiInput(lokasiSaatIni || lokasiLokal || "");
    setIsLocationModalOpen(true);
  };

  const handleSimpanLokasi = (pilihan) => {
    const nama = (
      typeof pilihan === "string" ? pilihan : lokasiInput
    ).trim();

    if (!nama) return;

    setLokasiLokal(nama);

    if (typeof onUbahLokasi === "function") {
      onUbahLokasi(nama);
    }

    setIsLocationModalOpen(false);
  };

  const handleNotificationClick = () =>
    alert("Anda memiliki 1 notifikasi baru!");

  const handleCategoryClick = (namaLayanan) =>
    alert(`Membuka layanan: ${namaLayanan}`);

  const handleMapClick = () => {
    if (onNavigateToMap) {
      onNavigateToMap();
    } else {
      alert("Membuka tampilan peta...");
    }
  };

  // Kirim data outlet yang diklik ke App.jsx.
  const handleOutletClick = (outlet) => {
    if (onNavigateToDetail) {
      onNavigateToDetail(outlet);
    }
  };

  return (
    <div className="p-5 font-sans bg-[#F8FBFF] min-h-screen pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-[11px] font-bold text-blue-500 tracking-wider mb-1 uppercase">
            Lokasi Saat Ini
          </p>

          <button
            onClick={handleLocationClick}
            className="flex items-center text-[#0B254D] font-bold cursor-pointer hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            {lokasiTampil}

            <svg
              className="w-4 h-4 ml-1 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block relative w-64 lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari outlet atau area..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          <button
            onClick={handleNotificationClick}
            aria-label="Lihat notifikasi"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 relative hover:bg-gray-50 transition-colors shrink-0"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">
          {sapaan}, {namaPelanggan}
        </p>

        <h1 className="text-3xl font-extrabold text-[#0B254D] leading-tight">
          Laundry bersih,
          <br />
          gak usah repot repot.
        </h1>
      </div>

      <div className="relative mb-8 md:hidden">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Cari outlet atau area..."
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <button
          onClick={() => handleCategoryClick("Cuci Kiloan")}
          className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-gray-50 hover:border-blue-300 hover:shadow-md transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-500 font-bold rounded-xl flex items-center justify-center mb-2">
            A
          </div>
          <span className="text-xs font-bold text-[#0B254D]">
            Cuci Kiloan
          </span>
          <span className="text-[10px] text-gray-400 mt-0.5">
            Mulai Rp7rb
          </span>
        </button>

        <button
          onClick={() => handleCategoryClick("Express 24 Jam")}
          className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-gray-50 hover:border-blue-300 hover:shadow-md transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-500 font-bold rounded-xl flex items-center justify-center mb-2">
            24
          </div>
          <span className="text-xs font-bold text-[#0B254D]">
            Express
          </span>
          <span className="text-[10px] text-gray-400 mt-0.5">
            Selesai cepat
          </span>
        </button>

        <button
          onClick={() => handleCategoryClick("Cuci Satuan")}
          className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-gray-50 hover:border-blue-300 hover:shadow-md transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-500 font-bold rounded-xl flex items-center justify-center mb-2">
            S
          </div>
          <span className="text-xs font-bold text-[#0B254D]">
            Satuan
          </span>
          <span className="text-[10px] text-gray-400 mt-0.5">
            Per item
          </span>
        </button>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[11px] font-bold text-blue-500 tracking-wider mb-1 uppercase">
              Di Sekitarmu
            </p>
            <h2 className="text-xl font-bold text-[#0B254D]">
              Outlet pilihan
            </h2>
            <p className="text-[11px] text-gray-400 font-bold">
              Diurutkan: {activeFilter}
            </p>
          </div>

          <button
            onClick={handleMapClick}
            className="text-sm font-bold text-blue-500 hover:text-blue-700 transition-colors"
          >
            Lihat peta
          </button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOutlets.map((outlet) => (
            <div
              key={outlet.id}
              onClick={() => handleOutletClick(outlet)}
              className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all active:scale-[0.98]"
            >
              <div className="relative h-40 bg-gray-200 w-full">
                <img
                  src={outlet.image}
                  alt={outlet.nama}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center shadow-sm">
                  <svg
                    className="w-3.5 h-3.5 text-green-500 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-[11px] font-bold text-green-600">
                    Terverifikasi
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  {outlet.ratingVal === maxRating && (
                    <span className="bg-yellow-400 text-[9px] font-bold px-2 py-0.5 rounded-full text-[#7C2D12] shadow-sm whitespace-nowrap">
                      Rating Tertinggi
                    </span>
                  )}

                  {outlet.hargaVal === minHarga && (
                    <span className="bg-green-100 text-[9px] font-bold px-2 py-0.5 rounded-full text-[#166534] shadow-sm whitespace-nowrap">
                      Harga Paling Murah
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-[#0B254D] text-base">
                    {outlet.nama}
                  </h3>

                  <div className="flex items-center text-orange-500 font-bold text-sm">
                    <svg
                      className="w-4 h-4 mr-1 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {outlet.rating}
                  </div>
                </div>

                <div className="flex items-center text-gray-400 text-[11px] mb-4">
                  <svg
                    className="w-3.5 h-3.5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {outlet.jarak} • {outlet.alamat}
                </div>

                <div className="bg-[#F4F8FF] rounded-xl p-3 flex justify-between items-center mb-4">
                  <span className="text-[13px] font-semibold text-[#0B254D]">
                    {outlet.layanan}
                  </span>
                  <span className="text-[13px] font-bold text-blue-600">
                    {outlet.harga}{" "}
                    <span className="text-gray-400 text-[10px] font-normal">
                      {outlet.satuan}
                    </span>
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <div className="flex items-center text-gray-500 text-[11px]">
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Selesai {outlet.estimasi}
                  </div>

                  <div
                    className={`flex items-center text-[11px] font-bold ${
                      outlet.status === "Buka"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-1.5 ${
                        outlet.status === "Buka"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {outlet.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl mx-4">
            <h3 className="text-lg font-bold text-[#0B254D] mb-1">
              Ubah Lokasi
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Pilih atau ketik lokasi Anda saat ini
            </p>

            <div className="mb-4">
              <input
                type="text"
                value={lokasiInput}
                onChange={(event) => setLokasiInput(event.target.value)}
                placeholder="Ketik nama area atau kota..."
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {lokasiPilihan.map((lokasi) => (
                <button
                  key={lokasi.nama}
                  onClick={() => {
                    setLokasiInput(lokasi.nama);
                    handleSimpanLokasi(lokasi.nama);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                    lokasiInput === lokasi.nama
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {lokasi.nama}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>

              <button
                onClick={() => handleSimpanLokasi()}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}