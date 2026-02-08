# 💍 Wedding Invitation Platform

Platform undangan pernikahan digital modern dengan fitur lengkap: Dashboard Admin, Tamu Undangan, RSVP, Galeri, dan QR Code Check-in.

---

## �️ Persyaratan Sistem

Sebelum memulai, pastikan komputer Anda sudah terinstall:

1.  **Node.js** (Versi 18 atau terbaru)
    *   Download: [nodejs.org](https://nodejs.org)
    *   Cek versi: `node -v`
2.  **MySQL Database** (XAMPP atau MySQL Server standalone)
    *   Pastikan service MySQL sudah berjalan.

---

## 🚀 Panduan Instalasi (Clean Install)

Ikuti langkah-langkah ini jika Anda baru pertama kali menjalankan project atau setelah menghapus folder `.next` dan `node_modules`.

### 1. Buka Terminal
Buka folder project ini di VS Code, lalu buka terminal (`Ctrl + ` `).

### 2. Install Dependencies
Jalankan perintah berikut untuk menginstall semua library yang dibutuhkan:

```bash
npm install
```
*Tunggu hingga proses selesai.*

### 3. Setup Environment (.env)
Pastikan file `.env` sudah ada. Jika belum, buat file baru bernama `.env` dan isi dengan konfigurasi berikut (sesuaikan dengan database Anda):

```env
# Koneksi Database MySQL
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="mysql://root:@localhost:3306/wedding_invitation"

# NextAuth Configuration
# Ganti dengan random string yang panjang dan unik
NEXTAUTH_SECRET="GANTI_DENGAN_STRING_ACAK_YANG_AMAN"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database
Jalankan perintah ini untuk membuat tabel dan data awal di database:

```bash
# Membuat struktur tabel di database
npx prisma db push

# (Opsional) Mengisi data awal / reset database
npx prisma db seed
```

### 5. Jalankan Aplikasi
Sekarang jalankan server development:

```bash
npm run dev
```

Tunggu sampai muncul pesan:
> **Ready in ... ms**
> **- Local: http://localhost:3000**

Buka browser dan akses **http://localhost:3000**

---

## 🔑 Login Admin

*   **URL**: [http://localhost:3000/login](http://localhost:3000/login)
*   **Username**: `admin`
*   **Password**: `admin123`

---

## ⚠️ Masalah Umum (Troubleshooting)

### Error: Turbopack "failed to create whole tree"

Jika muncul error seperti ini:
```
FATAL: An unexpected Turbopack error occurred.
Error [TurbopackInternalError]: failed to create whole tree
```

**Solusi:**
1. **Stop Server**: Tekan `Ctrl + C` di terminal.
2. **Hapus folder `.next`**:
   - **Windows (PowerShell)**: `Remove-Item -Recurse -Force .next`
   - **Mac/Linux**: `rm -rf .next`
3. **Jalankan ulang**: `npm run dev`

---

### Error Umum Lainnya

Jika masih error, lakukan **Reset Total**:

1.  **Stop Server**: Tekan `Ctrl + C` di terminal.
2.  **Hapus Cache**: Hapus folder `.next` (klik kanan -> delete).
3.  **Hapus Modules**: Hapus folder `node_modules`.
4.  **Install Ulang**: Jalankan `npm install`.
5.  **Jalankan Lagi**: `npm run dev`.

---

## 📱 Fitur Utama

*   **Dashboard Admin Responsif**: Kelola undangan dari HP atau Laptop.
*   **Cetak Undangan Massal**: Download undangan PDF siap cetak.
*   **Upload Background**: Ganti background undangan sesuka hati.
*   **QR Code Check-in**: Scan QR code tamu di lokasi acara.
*   **RSVP & Ucapan**: Tamu bisa konfirmasi kehadiran dan kirim doa.

---

**© 2026 Wedding Invitation Platform**
