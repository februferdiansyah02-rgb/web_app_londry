# Backend Londry API

Backend untuk aplikasi londry dengan fitur **Login** dan **Register**, menggunakan Express.js + JWT + file JSON sebagai penyimpanan data (tidak perlu database).

## Struktur Folder

```
backend/
├── server.js              # Entry point server Express
├── package.json           # Dependensi & script
├── .env                   # Variabel ambiente (buat dari .env.example)
├── .env.example           # Contoh variabel ambiente
├── .gitignore             # File yang diabaikan git
├── README.md              # Dokumentasi ini
├── data/
│   ├── users.json         # Penyimpanan data pengguna (JSON)
│   └── pesanan.json       # Penyimpanan data pesanan (JSON)
├── models/
│   ├── User.js            # Model pengguna (baca/tulis users.json)
│   └── Pesanan.js         # Model pesanan (baca/tulis pesanan.json)
├── controllers/
│   ├── authController.js  # Logic register, login, me
│   └── pesananController.js  # Logic pesanan (buat, lihat, update status, batalkan)
├── middleware/
│   ├── authMiddleware.js  # Middleware verifikasi JWT
│   └── roleMiddleware.js  # Middleware pembatas akses berdasarkan role
└── routes/
    ├── auth.js            # Routing /api/auth
    └── pesanan.js         # Routing /api/pesanan
```

## Endpoint

| Method | Endpoint | Deskripsi | Body |
|--------|----------|-----------|------|
| `GET` | `/api/health` | Cek status server | - |
| `POST` | `/api/auth/register` | Daftar akun baru | `{name, email, password, role?}` |
| `POST` | `/api/auth/login` | Masuk & dapatkan token | `{email, password}` |
| `GET` | `/api/auth/me` | Data pengguna sendiri | Header: `Authorization: Bearer <token>` |

### Pesanan (`/api/pesanan`)

| Method | Endpoint | Deskripsi | Body | Akses |
|--------|----------|-----------|------|-------|
| `POST` | `/api/pesanan` | Buat pesanan laundry baru | `{namaOutlet, layanan, berat?, totalHarga?, alamat?, estimasi?}` | Pelanggan (butuh token) |
| `GET` | `/api/pesanan/me` | Lihat pesanan saya sendiri | - | Pelanggan (butuh token) |
| `GET` | `/api/pesanan` | Lihat semua pesanan | - | Admin (butuh token) |
| `GET` | `/api/pesanan/:id` | Detail pesanan | - | Pemilik pesanan / admin |
| `PUT` | `/api/pesanan/:id/status` | Perbarui status pesanan | `{status}` | Admin / outlet (butuh token) |
| `DELETE` | `/api/pesanan/:id` | Batalkan pesanan | - | Pemilik pesanan (butuh token) |

Status yang valid: `Menunggu konfirmasi`, `Sedang diproses`, `Selesai`, `Dikirim`, `Dibatalkan`.

## Cara Menjalankan

1. Masuk ke folder backend:
   ```powershell
   cd backend
   ```

2. Instal dependensi:
   ```powershell
   npm install
   ```

3. Salin file contoh environment:
   ```powershell
   copy .env.example .env
   ```

4. Jalankan server:
   ```powershell
   # Mode development (auto restart saat file berubah)
   npm run dev

   # Atau mode production
   npm start
   ```

Server akan berjalan di `http://localhost:5000`.

## Contoh Penggunaan (curl / PowerShell)

**Register:**
```powershell
$body = @{name="Budi"; email="budi@londry.com"; password="rahasia123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

**Login:**
```powershell
$body = @{email="budi@londry.com"; password="rahasia123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

**Ambil data pengguna (butuh token):**
```powershell
$headers = @{Authorization = "Bearer <TOKEN_DARI_LOGIN>"}
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
```

**Buat pesanan laundry (butuh token pelanggan):**
```powershell
$body = @{
  namaOutlet="Bersih Laundry Setiabudi";
  layanan="Cuci + Setrika";
  berat=5;
  totalHarga=50000;
  alamat="Jl. Setiabudi No. 10";
  estimasi="Estimasi besok, 14.00"
} | ConvertTo-Json
$headers = @{Authorization = "Bearer <TOKEN_DARI_LOGIN>"}
Invoke-RestMethod -Uri "http://localhost:5000/api/pesanan" -Method Post -Body $body -ContentType "application/json" -Headers $headers
```

**Lihat pesanan saya (butuh token):**
```powershell
$headers = @{Authorization = "Bearer <TOKEN_DARI_LOGIN>"}
Invoke-RestMethod -Uri "http://localhost:5000/api/pesanan/me" -Method Get -Headers $headers
```

**Perbarui status pesanan (butuh token admin/outlet):**
```powershell
$body = @{status="Sedang diproses"} | ConvertTo-Json
$headers = @{Authorization = "Bearer <TOKEN_DARI_LOGIN>"}
Invoke-RestMethod -Uri "http://localhost:5000/api/pesanan/<ID_PESANAN>/status" -Method Put -Body $body -ContentType "application/json" -Headers $headers
```

## Akun Default

Sudah tersedia satu akun admin di `data/users.json`:
- Email: `admin@londry.com`
- Password: `admin123`
- Role: `admin`
