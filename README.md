# 💍 Wedding Invitation Platform

Platform undangan pernikahan digital modern dengan fitur lengkap: Dashboard Admin, Tamu Undangan, RSVP, Galeri, dan QR Code Check-in.

---

## 🛠️ Persyaratan Sistem

Sebelum memulai, pastikan komputer Anda sudah terinstall:

1.  **Node.js** (Versi 18 atau terbaru)
    *   Download: [nodejs.org](https://nodejs.org)
    *   Cek versi: `node -v`
2.  **MySQL Database** (XAMPP atau MySQL Server standalone)
    *   Pastikan service MySQL sudah berjalan.

---

## 🚀 Panduan Instalasi

Ikuti langkah-langkah ini untuk menjalankan project.

### 1. Buka Terminal
Buka folder project ini di VS Code, lalu buka terminal (`Ctrl + ` `).

### 2. Install Dependencies
```bash
npm install
```
*Tunggu hingga proses selesai.*

### 3. Setup Environment (.env)
Pastikan file `.env` sudah ada. Jika belum, buat file baru bernama `.env` dan isi:

```env
# Koneksi Database MySQL
DATABASE_URL="mysql://root:@localhost:3306/wedding_invitation"

# NextAuth Configuration (GANTI dengan string acak yang aman)
NEXTAUTH_SECRET="GANTI_DENGAN_STRING_ACAK_YANG_AMAN"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database
```bash
npx prisma db push
npx prisma db seed
```

### 5. Build & Jalankan Aplikasi (Production Mode)

**Mode Production** lebih stabil dan tidak menggunakan Turbopack:

```bash
# Build aplikasi (1x saja, atau setiap ada perubahan code)
npm run build

# Jalankan server
npm start
```

Buka browser dan akses **http://localhost:3000**

---

## 🔄 Mode Development (Opsional)

Jika ingin development dengan hot reload (auto-refresh saat edit code):

```bash
npm run dev
```

> ⚠️ Mode ini menggunakan Turbopack dan mungkin error di beberapa komputer. Jika error, gunakan **Production Mode** di atas.

---

## 🔑 Login Admin

*   **URL**: [http://localhost:3000/login](http://localhost:3000/login)
*   **Username**: `admin`
*   **Password**: `admin123`

---

## ⚠️ Troubleshooting

### Error saat `npm run dev` (Turbopack)

Gunakan **Production Mode** sebagai alternatif:
```bash
npm run build
npm start
```

### Error: "Cannot find module..."
```bash
npm install
```

### Error: Database connection failed
Pastikan MySQL sudah running dan file `.env` sudah benar.

---

## 📱 Fitur Utama

*   **Dashboard Admin Responsif**: Kelola undangan dari HP atau Laptop.
*   **Cetak Undangan Massal**: Download undangan PDF siap cetak.
*   **Upload Background**: Ganti background undangan sesuka hati.
*   **QR Code Check-in**: Scan QR code tamu di lokasi acara.
*   **RSVP & Ucapan**: Tamu bisa konfirmasi kehadiran dan kirim doa.

---

**© 2026 Wedding Invitation Platform**
