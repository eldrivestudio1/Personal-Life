# Ritme — Daily Planner

Aplikasi pengelola kegiatan harian menggunakan **HTML5, CSS3, dan Vanilla JavaScript murni**, tanpa framework atau library JavaScript eksternal.

## Fitur

- Tambah, edit, hapus, dan tandai kegiatan selesai.
- Mulai kegiatan untuk tracking status berjalan.
- Kategori, prioritas, jadwal, estimasi durasi, dan catatan.
- Filter status serta pencarian kegiatan.
- Dashboard progres harian.
- Grafik batang kegiatan selesai selama 7 hari.
- Grafik donat komposisi status kegiatan.
- Insight produktivitas berdasarkan progres harian.
- Tema terang dan gelap.
- Penyimpanan lokal browser menggunakan `localStorage`.
- Ekspor backup JSON.
- Layout mobile-first dan responsif.
- Manifest dan service worker untuk instalasi PWA serta cache offline dasar.

## Struktur proyek

```text
ritme-vanilla/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── manifest.json
├── sw.js
├── assets/
│   └── icon.svg
└── README.md
```

## Menjalankan di komputer

Service worker dan fitur PWA memerlukan `localhost` atau HTTPS. Dari direktori proyek jalankan:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

Alternatif: gunakan ekstensi server lokal di editor kode. Membuka `index.html` langsung dengan `file://` masih bisa menampilkan aplikasi, tetapi PWA/offline service worker tidak akan berjalan.

## Deploy

Unggah seluruh folder proyek ke hosting statis dengan HTTPS, misalnya GitHub Pages, Netlify, atau Vercel. Jangan ubah lokasi relatif file kecuali path di HTML, manifest, dan service worker ikut diperbarui.

## Catatan data

- Data disimpan di browser/perangkat saat ini, bukan di server.
- Data tidak otomatis tersinkronisasi antarperangkat atau browser.
- Ekspor JSON tersedia sebagai backup manual; fitur impor belum disediakan.
- Grafik 7 hari menghitung kegiatan yang statusnya selesai berdasarkan tanggal kegiatan.
- Tidak ada framework, bundler, package manager, atau library grafik yang dibutuhkan.


## Pembaruan fitur: subtask dan UI baru

- Setiap kegiatan dapat memiliki hingga 20 langkah kecil (subtask).
- Tambahkan langkah kecil dari formulir kegiatan, lalu tandai satu per satu dari kartu kegiatan.
- Progres subtask ditampilkan dengan hitungan dan progress bar.
- Menandai seluruh subtask selesai akan menandai kegiatan induk selesai. Menandai kegiatan induk selesai juga menyelesaikan seluruh subtask; membatalkan salah satu subtask akan membuka kembali kegiatan induk.
- Tampilan diperbarui dengan palet jade/hijau, permukaan yang lebih bersih, kartu lebih halus, dan gaya dark mode yang disesuaikan.
- Cache service worker dinaikkan ke v2 agar pembaruan aset lebih mudah diterapkan.
