# CLAUDE.md

# DBARENA Engineering Constitution

Version: 1.0

---

# PROJECT OVERVIEW

Project Name:

DBARENA (Debater Battle Arena)

DBARENA adalah platform komunitas battleboarding Indonesia yang berfokus pada:

* Anime Debate
* Battleboarding
* Event Community
* News
* User Profile
* Ranked
* Leaderboard
* Documentation
* Community Growth

Target utama adalah membangun platform battleboarding modern dengan kualitas setara platform komunitas besar.

Semua perubahan harus mempertimbangkan skalabilitas jangka panjang.

---

# CORE PRINCIPLES

Selalu prioritaskan:

* Stability
* Maintainability
* Scalability
* Performance
* Clean UI
* Responsive Design

Jangan mengorbankan stabilitas hanya demi implementasi fitur baru.

---

# TECH STACK

Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

Backend

* Supabase

Storage

* Supabase Storage

Deployment

* Vercel

---

# DEVELOPMENT PHILOSOPHY

Sebelum mengubah kode:

1. Analisa struktur project.
2. Cari implementasi yang sudah ada.
3. Gunakan komponen yang sudah tersedia.
4. Jangan membuat ulang fungsi yang sudah ada.
5. Jangan melakukan refactor besar tanpa diminta.

---

# DATABASE RULES

Selalu cek struktur database terlebih dahulu.

Jangan mengasumsikan:

* nama tabel
* nama kolom
* relasi
* tipe data

Jika membutuhkan perubahan database:

1. Jelaskan alasannya.
2. Buat migration SQL.
3. Pastikan migration aman.
4. Baru gunakan di kode.

Jangan pernah menggunakan kolom yang belum dibuat.

---

# STORAGE RULES

Semua upload gambar menggunakan Supabase Storage.

Jangan menggunakan:

/images/

atau asset lokal sebagai penyimpanan permanen.

Gunakan public URL dari Storage.

Pastikan:

* gambar HD
* tidak blur
* tidak ter-compress
* crop sesuai

---

# FEATURE IMPLEMENTATION ORDER

Saat membuat fitur baru:

1. Database
2. Types
3. Backend
4. API
5. Frontend
6. UI
7. Testing

Jangan memulai dari UI jika struktur data belum siap.

---

# BACKWARD COMPATIBILITY

Jangan pernah merusak:

* Follow System
* Login
* Routing
* News
* Dashboard
* Existing API

Semua fitur lama harus tetap berjalan.

---

# UI DESIGN

Gunakan style modern.

Inspirasi:

* GitHub
* Discord
* Steam
* X
* Riot Games

Prioritas:

* Clean
* Elegant
* Minimal
* Professional

---

# RESPONSIVE

Desktop merupakan prioritas utama.

Mobile tetap harus usable.

Dashboard hanya ditujukan untuk desktop.

---

# PERFORMANCE

Prioritaskan:

* Lazy Loading
* Dynamic Import
* Memoization
* Optimistic UI
* Pagination
* Infinite Scroll jika diperlukan

Hindari:

* Query berulang
* Re-render berlebihan
* Fetch data yang tidak digunakan

---

# ERROR HANDLING

Jika terjadi error:

Jangan langsung mengubah banyak file.

Langkah wajib:

1. Temukan akar masalah.
2. Jelaskan penyebab.
3. Berikan solusi minimal.
4. Pastikan solusi tidak merusak fitur lain.

---

# DEBUGGING

Saat debugging:

Selalu tampilkan:

* Error Code
* Error Message
* Error Details
* Root Cause

Jangan hanya menampilkan:

{}

---

# BUILD REQUIREMENTS

Setiap perubahan wajib lolos:

npm run build

Tidak boleh ada:

* TypeScript Error
* Hydration Error
* Runtime Error
* ESLint Error

---

# NEWS SYSTEM

News mendukung:

* Cover Image
* Multiple Images
* Voting
* Rich Content
* Link Preview
* Lazy Loading

Semua fitur harus tetap kompatibel.

---

# PROFILE SYSTEM

Profile mendukung:

* Banner
* Avatar
* Badge
* Activity
* Statistics
* Followers
* Following
* Social Links

Desain modern.

---

# USER MANAGEMENT

Admin dapat:

* Verify User
* Suspend User
* Ban User
* Promote Staff
* Promote Editor

---

# SECURITY

Selalu gunakan:

* RLS
* Validasi Input
* Sanitasi Data
* Permission Checking

Jangan pernah mempercayai input client.

---

# CODE STYLE

Kode harus:

* mudah dibaca
* modular
* reusable
* memiliki nama variabel yang jelas

Hindari:

* Magic Number
* Hardcoded String
* Duplicate Logic

---

# FILE MODIFICATION POLICY

Sebelum mengubah file:

1. Cari apakah sudah ada implementasi.
2. Jangan membuat file baru jika file lama dapat diperluas.
3. Jangan menghapus fungsi tanpa alasan.

---

# AI BEHAVIOR

Jangan membuat asumsi.

Jika informasi tidak tersedia:

Analisa project terlebih dahulu.

Jika masih belum cukup:

Berikan penjelasan daripada menebak.

---

# OUTPUT FORMAT

Jika perubahan membutuhkan:

Database

→ Berikan migration SQL.

Environment

→ Sebutkan variable baru.

Storage

→ Jelaskan bucket yang digunakan.

API

→ Jelaskan endpoint yang berubah.

---

# FINAL CHECKLIST

Sebelum menyelesaikan pekerjaan pastikan:

✓ Tidak merusak fitur lama.

✓ Build berhasil.

✓ Responsive tetap baik.

✓ Tidak ada query yang tidak diperlukan.

✓ Tidak ada TypeScript Error.

✓ Tidak ada Runtime Error.

✓ Tidak ada Hydration Error.

✓ Tidak ada SQL yang berbahaya.

✓ Tidak ada perubahan yang tidak diminta.

Jika ada potensi breaking change, hentikan implementasi dan jelaskan terlebih dahulu sebelum melakukan perubahan.
