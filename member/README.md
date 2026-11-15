# 📱 Dialogika Presensi Member

Portal Presensi & LMS Siswa Mandiri untuk murid PT Dialogika Persona Indonesia — berbasis web responsif (Mobile/Tablet/Desktop) tanpa perlu login password (cukup verifikasi menggunakan nomor WhatsApp terdaftar).

🌐 **Live Production URL:** [https://dialogika.co/member](https://dialogika.co/member)

---

## 📁 Struktur Proyek

```text
member/
├── index.html                           # Halaman utama portal presensi & LMS siswa
├── firebase.json                        # Konfigurasi hosting, rewrites, dan caching Firebase
├── .firebaserc                          # Target project Firebase (dialogika-co)
├── .gitignore                           # Aturan pengabaian file Git
├── README.md                            # Dokumentasi resmi proyek
├── template.png                         # Template background sertifikat kelulusan
│
├── assets/
│   ├── css/
│   │   ├── member-attendance.css        # Styling UI portal presensi, badge, dan modal
│   │   └── theme.css                    # Variabel tema, warna brand, dan font Dialogika
│   ├── img/
│   │   ├── favicon.webp                 # Favicon resmi Dialogika
│   │   ├── logo.webp                    # Logo Dialogika
│   │   └── student-hero.jpg             # Ilustrasi banner hero portal siswa
│   └── js/
│       ├── firebase-config.js           # Inisialisasi Firebase SDK & Cloud Firestore
│       ├── member-attendance.js         # Orchestrator logika presensi, view switching, & check-in
│       ├── member-attendance.repository.js # Jembatan Firestore (data_member, attendance, certificates)
│       ├── member-attendance.ui.js      # Komponen tampilan: kartu kelas, rekap, & modal ekspor
│       ├── mentor-management.repository.js # Integrasi data master coach/mentor
│       └── utils/
│           └── export-helper.js         # Helper export spreadsheet Excel (.xlsx) & CSV
│
└── docs/
    └── MEMBER-ATTENDANCE-ARCHITECTURE.md # Dokumentasi teknis & arsitektur database lengkap
```

---

## ⚙️ Setup & Deployment

### 1. Production Deployment (Website Utama Dialogika)
Portal presensi siswa live di alamat resmi **`https://dialogika.co/member`** yang di-hosting menggunakan **GitHub Pages** (`dialogika.github.io`).
* **Repository Target:** `https://github.com/dialogika/dialogika.github.io.git`
* **Direktori:** Letakkan file portal di dalam folder `member/` pada branch `master`.
* **Proses Rilis:** Commit dan push ke branch `master`, GitHub Pages akan memproses build otomatis dalam 1–2 menit:
  ```bash
  cd website_utama/dialogika.github.io
  git add member/
  git commit -m "feat/fix: update member portal"
  git push origin master
  ```

> ⚠️ **Catatan Penting Path Aset (Relative Path):**  
> Semua tag referensi aset di `index.html` (gambar, CSS, script JS) **wajib menggunakan path relatif** (`./assets/...`), bukan path absolut (`/assets/...`). Hal ini agar aset terpanggil dengan benar dari subfolder `/member/` dan tidak memicu error 404 saat dibuka maupun di-refresh.

### 2. Standalone Development & Firebase Emulators
Untuk keperluan pengujian lokal menggunakan Firebase Emulator Suite:
```bash
# Menjalankan emulator lokal (Hosting port 5001 & Firestore)
firebase emulators:start
```
Jika ingin mendeploy instance standalone ke Firebase Hosting project `dialogika-co`:
```bash
firebase deploy --only hosting
```

### 3. Database & Keamanan
* **Database:** Terhubung otomatis ke Google Cloud Firestore project `dialogika-co`.
* **Keamanan (Firestore Rules):** Koleksi `member_attendance` dan `certificate_logs` diatur dengan izin baca/tulis publik terkontrol sesuai `firestore.rules`.
* **Konfigurasi Caching:** File `firebase.json` dan meta tag HTTP-Equiv diatur dengan header `Cache-Control: no-cache, no-store` agar browser siswa selalu memuat versi script terbaru.

---

## 📑 Halaman & Fitur Utama

| Fitur / Tab | File Terkait | Fungsi Utama |
| :--- | :--- | :--- |
| **Check-in Siswa** | `index.html` & `member-attendance.js` | Siswa memasukkan No. WhatsApp untuk verifikasi dan konfirmasi kehadiran sesi hari ini. |
| **Multi-Profil Anak** | `member-attendance.ui.js` | Jika 1 nomor WA orang tua dipakai untuk beberapa anak, muncul pilihan profil anak secara otomatis. |
| **Riwayat & Sesi Kelas** | `member-attendance.repository.js` | Menampilkan kartu kelas aktif, mentor pengampu, progres pertemuan, dan status belajar. |
| **Remedial (Mengulang)** | `member-attendance.js` | Deteksi dan pencatatan siswa yang mengulang materi/sesi karena izin atau sakit. |
| **Rekap Presensi** | `index.html` (Tab Rekap) | Panel rekap kehadiran harian untuk admin/resepsionis di lokasi kelas (`/member?admin=true`). |
| **Data Mengulang** | `index.html` (Tab Mengulang) | Pantauan khusus daftar siswa yang hadir mengulang/remedial kelas. |
| **Download Sertifikat** | `member-attendance.js` | Siswa yang sudah lulus dapat langsung mengunduh sertifikat resmi (format PDF/SVG). |
| **Ekspor Excel** | `export-helper.js` | Mengunduh data rekap kehadiran dan data remedial ke file spreadsheet Excel (.xlsx). |

---

## 🔄 Alur Presensi Mandiri (Workflow)

```text
[Siswa Input No. WhatsApp]
           │
           ▼
1. Query ke Koleksi `data_member`
   - Normalisasi nomor internasional (+62, 08, spasi)
   - Cek identitas siswa & paket yang dibeli
           │
           ▼
2. Sinkronisasi `class_planning` & `member_attendance`
   - Mengambil jadwal batch kelas aktif & nama mentor
   - Cek apakah siswa hadir reguler atau mengulang (remedial)
           │
           ▼
3. Konfirmasi Presensi
   - Siswa klik "Konfirmasi Kehadiran"
   - Tercatat otomatis ke database `member_attendance`
   - Tombol otomatis terkunci (anti double absen di hari yang sama)
```

---

## 🛠️ Teknologi yang Digunakan

* **Frontend:** Vanilla JavaScript (Modern ES Modules), Tailwind CSS, Bootstrap Icons
* **Database & Cloud:** Google Cloud Firestore (Real-Time Database), Firebase Hosting / GitHub Pages
* **Spreadsheet Engine:** ExcelJS v4.4.0 (Export Excel berformat rapi & CSV)
* **Design & Typography:** Google Fonts (Montserrat & Poppins)
