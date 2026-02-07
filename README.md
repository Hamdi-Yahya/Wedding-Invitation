# 💍 Wedding Invitation - Digital Wedding Invitation Platform

Sebuah platform undangan pernikahan digital modern dengan fitur QR Code check-in, RSVP online, dan dashboard admin.

---

## 📋 Persyaratan Sistem

Sebelum menjalankan project ini, pastikan sudah terinstall:

| Software | Versi Minimum | Download |
|----------|---------------|----------|
| Node.js | v18.0.0+ | [nodejs.org](https://nodejs.org) |
| npm | v9.0.0+ | Termasuk dalam Node.js |

### Cara Cek Versi:
```bash
node --version
npm --version
```

---

## 🚀 Instruksi Setup (Langkah demi Langkah)

### Langkah 1: Buka Terminal/Command Prompt

- **Windows**: Klik kanan di folder project → "Open in Terminal" atau buka CMD lalu `cd` ke folder project
- **Mac/Linux**: Buka Terminal, lalu `cd` ke folder project

### Langkah 2: Install Dependencies

```bash
npm install
```

> ⏳ Tunggu hingga selesai (bisa memakan waktu 2-5 menit tergantung koneksi internet)

### Langkah 3: Setup Database

```bash
npx prisma generate
npx prisma db push
```

### Langkah 4: Jalankan Project

```bash
npm run dev
```

### Langkah 5: Buka di Browser

Setelah muncul pesan "Ready", buka browser dan akses:

```
http://localhost:3000
```

---

## 🔑 Login Dashboard Admin

Untuk mengakses dashboard admin, buka:

```
http://localhost:3000/login
```

**Default Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

---

## 📂 Struktur Menu Dashboard

| Menu | Fungsi |
|------|--------|
| **Dashboard** | Ringkasan statistik tamu & RSVP |
| **Event Details** | Atur detail acara (nama, tanggal, lokasi, ceremony, reception) |
| **Guest List** | CRUD tamu, download undangan (PNG/JPG/PDF) |
| **RSVP** | Lihat daftar ucapan & konfirmasi kehadiran |
| **Galeri** | Upload & kelola foto prewedding |
| **Scanner** | Scan QR Code untuk check-in tamu |
| **Settings** | Atur tema warna & font undangan |

---

## 🎯 Fitur Utama

1. **CRUD Penerima Undangan** - Tambah, edit, hapus daftar tamu
2. **QR Code Unik** - Setiap tamu mendapat QR code unik untuk check-in
3. **QR Scanner** - Scan QR untuk registrasi kehadiran tamu
4. **Download Undangan** - Export undangan ke PNG, JPG, atau PDF
5. **RSVP Online** - Tamu dapat konfirmasi kehadiran via web
6. **Galeri Foto** - Upload foto prewedding yang tampil di undangan
7. **Tema Kustomisasi** - Ubah warna dan font sesuai keinginan

---

## ⚠️ Troubleshooting

### Error: "Turbopack failed to create whole tree"

Jalankan dengan perintah ini:
```bash
npx next dev --no-turbo
```

### Error: "Cannot find module..."

Jalankan ulang:
```bash
npm install
```

### Error: "Database connection failed"

Pastikan file `.env` ada dan berisi:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

Lalu jalankan:
```bash
npx prisma generate
npx prisma db push
```

### Port 3000 sudah digunakan

Tutup aplikasi lain yang menggunakan port 3000, atau restart komputer, lalu jalankan ulang:
```bash
npm run dev
```

---

## 🛑 Cara Menghentikan Server

Tekan `Ctrl + C` di terminal.

---

## 📞 Kontak Support

Jika mengalami kendala, hubungi developer.

---

## 📝 Catatan Penting

- **JANGAN** hapus folder `prisma/` - berisi struktur database
- **JANGAN** hapus file `.env` - berisi konfigurasi penting
- Folder `node_modules/` dan `.next/` akan otomatis dibuat saat menjalankan `npm install` dan `npm run dev`

---

**© 2026 Wedding Invitation Platform**
