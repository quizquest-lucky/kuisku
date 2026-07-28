## Tujuan

Pendaftaran kini memakai **username + sandi**. Username yang sudah dipakai ditolak, dan setelah keluar akun pengguna bisa masuk lagi dengan username + sandi yang sama, dengan skor lamanya kembali.

## Perubahan database

Tabel baru `player_credentials` (terpisah dari `players` supaya hash sandi tidak pernah ikut terbaca di leaderboard publik):
- `player_id` (kunci utama, mengacu ke pemain)
- `username_lower` unik — mencegah nama ganda tanpa peduli huruf besar/kecil
- `password_hash`, `password_salt`
- Tanpa akses publik sama sekali; hanya dibaca/ditulis lewat fungsi server tepercaya.

Tabel `players` juga diberi indeks unik pada username (huruf kecil).

## Fungsi server baru

- **Daftar** — validasi username (3–20 karakter) dan sandi (minimal 6 karakter), cek ketersediaan nama, buat Player ID + avatar, simpan hash sandi (PBKDF2 via Web Crypto, salt acak per pemain), lalu kembalikan profil awal. Jika nama sudah dipakai → pesan "Username sudah dipakai, coba nama lain".
- **Masuk** — cari username, verifikasi sandi, lalu kembalikan profil lengkap dari database (total skor, skor per jenjang, jumlah iklan) sehingga progres pulih di perangkat mana pun.
- **Cek username** (opsional, dipakai saat mengetik) — memberi tanda hijau/merah ketersediaan nama secara langsung.

Semua respons gagal memakai pesan umum ("Username atau sandi salah") agar tidak membocorkan akun mana yang ada.

## Perubahan UI

`WelcomeScreen` menjadi layar dua mode dengan tab **Daftar** / **Masuk**:
- Daftar: input Nama Pemain, Sandi, Konfirmasi Sandi, pratinjau avatar, indikator ketersediaan nama.
- Masuk: input Nama Pemain + Sandi.
- Tombol punya keadaan memuat dan menampilkan pesan galat di bawah input (Bahasa Indonesia).

`src/routes/index.tsx` memanggil fungsi daftar/masuk, menyimpan profil hasilnya ke localStorage, lalu masuk ke dashboard. Alur keluar akun tetap seperti sekarang (hapus profil lokal) — data di cloud tetap aman sehingga bisa dipakai masuk lagi.

## Catatan teknis

- Hash sandi memakai `crypto.subtle` PBKDF2-SHA256 (kompatibel runtime server), bukan library Node-only.
- Penulisan kredensial memakai klien admin di dalam handler fungsi server; sandi tidak pernah dikirim balik ke browser.
- Pemain lama yang sudah ada di perangkat tetap bisa main; saat mereka keluar dan ingin masuk lagi mereka perlu mendaftar ulang (akun lama belum punya sandi). Ini akan dijelaskan lewat teks kecil di layar Masuk.
