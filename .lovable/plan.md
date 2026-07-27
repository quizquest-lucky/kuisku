## Tujuan

Menghilangkan semua penyebutan "AI" di antarmuka, mengganti menu pengaturan dengan tombol Keluar Akun, menambahkan Halaman Event, dan menambah satu slot iklan.

## 1. Halaman Detail Kuis (PrepScreen)

- Hapus kotak peringatan merah "1 Salah atau Waktu Habis = Game Over (Bisa Lanjut dengan Nonton Iklan)".
- Ubah butir daftar "20 soal pilihan ganda dibuat oleh AI" → "20 soal pilihan ganda".
- Dua butir lain (poin +5 dan papan peringkat) tetap.

## 2. Halaman Loading

- Judul "Menyiapkan AI..." → "Menyiapkan Soal...".
- Deskripsi → "Menyiapkan 20 soal {mapel} untuk kelas {kelas}."
- Baris bawah "Soal dibuat khusus untuk sesi ini" tetap (tanpa kata AI).
- Cek juga pesan lain yang menyebut AI (mis. notifikasi "AI sedang sibuk" saat fallback) dan ubah jadi netral, contoh "Koneksi lambat — sebagian soal diambil dari bank soal offline."

## 3. Menu Pengaturan → Logout

- Hapus seluruh bagian input Google Gemini API Key dari panel pengaturan.
- Panel pengaturan kini berisi ringkasan akun (username + Player ID) dan tombol merah **Keluar Akun**, dengan konfirmasi singkat sebelum keluar.
- Keluar akun: hapus profil dari penyimpanan perangkat, kembali ke layar Welcome. Skor yang sudah tersimpan di papan peringkat cloud tetap ada.
- Hapus penyimpanan & penggunaan kunci Gemini sepenuhnya: hapus helper penyimpanan kunci, hapus state `geminiKey` di route utama, dan hapus pengiriman `userApiKey` ke fungsi pembuat soal. Kunci lama di perangkat dibersihkan otomatis saat aplikasi dibuka.

## 4. Kartu "Event" & Halaman Event

- Di dashboard, kartu statistik "Iklan Ditonton" diganti menjadi kartu tombol **Event** (ikon kalender/hadiah, gaya neon sesuai tema) di sebelah Total Skor.
- Klik → membuka Halaman Event (layar baru dalam alur aplikasi, dengan tombol Kembali), berisi 3 kotak:
  1. **Event Juli** — detail hadiah, status "Aktif" hanya di bulan Juli, selain itu bertanda terkunci / "Segera Hadir".
  2. **Event Desember** — sama, aktif hanya di bulan Desember.
  3. **Gabung Saluran WhatsApp** — membuka https://whatsapp.com/channel/0029VbDaqXyFMqrfR1JsLy2I di tab baru.
- Kotak event menampilkan syarat dan hadiah (mis. bonus poin & lencana musiman); tidak ada mekanisme klaim pada tahap ini.

## 5. Slot Iklan Kedua

- Di bagian bawah dashboard, tampilkan dua slot iklan bertumpuk (masing-masing bergaya glass, label "Iklan Sponsor", ukuran 320x100).

## Catatan teknis

- File yang disentuh: `src/components/quiz/PrepScreen.tsx`, `LoadingScreen.tsx`, `DashboardScreen.tsx`, komponen baru `EventScreen.tsx`, `src/lib/player-storage.ts`, `src/lib/quiz.functions.ts` / `quiz-ai.server.ts` (hapus jalur `userApiKey`), dan `src/routes/index.tsx` (state layar `event`, handler logout).
- Pembuatan soal tetap memakai model bawaan aplikasi di sisi server; hanya penyebutan di UI yang dihapus.
