import type { QuizQuestion, Subject } from "./quiz-config";

/**
 * Bank soal cadangan — dipakai hanya jika AI gagal membuat soal.
 * Dikelompokkan per mata pelajaran dan tingkat kesulitan (dasar / menengah / lanjut).
 */
type Level = "dasar" | "menengah" | "lanjut";

const BANK: Record<Subject, Record<Level, QuizQuestion[]>> = {
  Matematika: {
    dasar: [
      { question: "Berapakah 7 + 8?", options: ["13", "14", "15", "16"], answer: "15" },
      { question: "Berapakah 9 x 3?", options: ["21", "24", "27", "29"], answer: "27" },
      { question: "Berapakah 45 - 18?", options: ["27", "28", "26", "37"], answer: "27" },
      { question: "Berapakah 36 : 4?", options: ["6", "8", "9", "12"], answer: "9" },
      {
        question: "Bangun datar dengan tiga sisi disebut...",
        options: ["Persegi", "Segitiga", "Lingkaran", "Trapesium"],
        answer: "Segitiga",
      },
      { question: "Berapakah 1/2 dari 60?", options: ["20", "25", "30", "35"], answer: "30" },
      {
        question: "Bilangan genap setelah 18 adalah...",
        options: ["19", "20", "21", "22"],
        answer: "20",
      },
      {
        question: "Keliling persegi dengan sisi 5 cm adalah...",
        options: ["10 cm", "15 cm", "20 cm", "25 cm"],
        answer: "20 cm",
      },
    ],
    menengah: [
      {
        question: "Hasil dari (-6) + 14 adalah...",
        options: ["8", "-8", "20", "-20"],
        answer: "8",
      },
      { question: "Nilai x pada 3x = 27 adalah...", options: ["6", "7", "9", "12"], answer: "9" },
      {
        question: "Luas lingkaran dengan jari-jari 7 cm (π = 22/7) adalah...",
        options: ["154 cm²", "144 cm²", "44 cm²", "77 cm²"],
        answer: "154 cm²",
      },
      { question: "Akar kuadrat dari 144 adalah...", options: ["11", "12", "13", "14"], answer: "12" },
      {
        question: "Hasil dari 2³ x 2² adalah...",
        options: ["16", "32", "64", "10"],
        answer: "32",
      },
      {
        question: "Rata-rata dari 4, 8, 10, dan 6 adalah...",
        options: ["6", "7", "8", "9"],
        answer: "7",
      },
      {
        question: "Volume kubus dengan rusuk 4 cm adalah...",
        options: ["16 cm³", "48 cm³", "64 cm³", "24 cm³"],
        answer: "64 cm³",
      },
      {
        question: "Jika 5 buku harganya Rp20.000, harga 8 buku adalah...",
        options: ["Rp28.000", "Rp30.000", "Rp32.000", "Rp36.000"],
        answer: "Rp32.000",
      },
    ],
    lanjut: [
      {
        question: "Turunan pertama dari f(x) = x³ adalah...",
        options: ["3x²", "x²", "3x", "x⁴/4"],
        answer: "3x²",
      },
      {
        question: "Nilai sin 30° adalah...",
        options: ["1/2", "√2/2", "√3/2", "1"],
        answer: "1/2",
      },
      {
        question: "Diskriminan dari x² - 5x + 6 adalah...",
        options: ["1", "5", "6", "25"],
        answer: "1",
      },
      {
        question: "Hasil dari log 1000 (basis 10) adalah...",
        options: ["2", "3", "10", "100"],
        answer: "3",
      },
      {
        question: "Suku ke-10 barisan aritmetika 3, 7, 11, ... adalah...",
        options: ["37", "39", "41", "43"],
        answer: "39",
      },
      {
        question: "Integral dari 2x dx adalah...",
        options: ["x² + C", "2x² + C", "x + C", "2 + C"],
        answer: "x² + C",
      },
      {
        question: "Jika f(x) = 2x + 1, maka f(5) adalah...",
        options: ["9", "10", "11", "12"],
        answer: "11",
      },
      {
        question: "Banyak cara menyusun 4 orang dalam satu baris adalah...",
        options: ["12", "16", "24", "32"],
        answer: "24",
      },
    ],
  },
  IPA: {
    dasar: [
      {
        question: "Hewan yang bernapas dengan insang adalah...",
        options: ["Ikan", "Kucing", "Burung", "Katak dewasa"],
        answer: "Ikan",
      },
      {
        question: "Bagian tumbuhan yang menyerap air dari tanah adalah...",
        options: ["Daun", "Akar", "Batang", "Bunga"],
        answer: "Akar",
      },
      {
        question: "Sumber energi utama bagi bumi adalah...",
        options: ["Bulan", "Matahari", "Angin", "Air"],
        answer: "Matahari",
      },
      {
        question: "Perubahan wujud air menjadi uap disebut...",
        options: ["Membeku", "Menguap", "Mencair", "Menyublim"],
        answer: "Menguap",
      },
      {
        question: "Indera untuk mencium bau adalah...",
        options: ["Mata", "Telinga", "Hidung", "Lidah"],
        answer: "Hidung",
      },
      {
        question: "Benda yang dapat ditarik magnet terbuat dari...",
        options: ["Plastik", "Besi", "Kayu", "Kaca"],
        answer: "Besi",
      },
      {
        question: "Tumbuhan membuat makanan melalui proses...",
        options: ["Respirasi", "Fotosintesis", "Ekskresi", "Adaptasi"],
        answer: "Fotosintesis",
      },
      {
        question: "Planet tempat kita tinggal adalah...",
        options: ["Mars", "Venus", "Bumi", "Jupiter"],
        answer: "Bumi",
      },
    ],
    menengah: [
      {
        question: "Satuan gaya dalam SI adalah...",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        answer: "Newton",
      },
      {
        question: "Organ manusia yang memompa darah adalah...",
        options: ["Paru-paru", "Jantung", "Ginjal", "Hati"],
        answer: "Jantung",
      },
      {
        question: "Zat yang memiliki pH kurang dari 7 bersifat...",
        options: ["Basa", "Netral", "Asam", "Garam"],
        answer: "Asam",
      },
      {
        question: "Rumus kimia air adalah...",
        options: ["CO2", "H2O", "O2", "NaCl"],
        answer: "H2O",
      },
      {
        question: "Alat untuk mengukur suhu adalah...",
        options: ["Barometer", "Termometer", "Higrometer", "Anemometer"],
        answer: "Termometer",
      },
      {
        question: "Proses pengeluaran zat sisa oleh ginjal menghasilkan...",
        options: ["Keringat", "Urine", "Empedu", "Karbon dioksida"],
        answer: "Urine",
      },
      {
        question: "Cahaya merambat dengan cara...",
        options: ["Melengkung", "Lurus", "Acak", "Melingkar"],
        answer: "Lurus",
      },
      {
        question: "Bagian sel yang mengatur seluruh kegiatan sel adalah...",
        options: ["Membran", "Sitoplasma", "Inti sel", "Vakuola"],
        answer: "Inti sel",
      },
    ],
    lanjut: [
      {
        question: "Hukum Newton II dirumuskan sebagai...",
        options: ["F = m × a", "E = m × c²", "P = F / A", "W = F × s"],
        answer: "F = m × a",
      },
      {
        question: "Unsur dengan lambang Fe adalah...",
        options: ["Fluor", "Besi", "Fosfor", "Perak"],
        answer: "Besi",
      },
      {
        question: "Pembelahan sel kelamin disebut...",
        options: ["Mitosis", "Meiosis", "Amitosis", "Sitokinesis"],
        answer: "Meiosis",
      },
      {
        question: "Energi potensial gravitasi dirumuskan...",
        options: ["m g h", "½ m v²", "m v", "F s"],
        answer: "m g h",
      },
      {
        question: "Ikatan pada molekul NaCl adalah ikatan...",
        options: ["Kovalen", "Ion", "Logam", "Hidrogen"],
        answer: "Ion",
      },
      {
        question: "Molekul pembawa informasi genetik adalah...",
        options: ["ATP", "DNA", "RNA transfer", "Protein"],
        answer: "DNA",
      },
      {
        question: "Satuan daya listrik adalah...",
        options: ["Volt", "Ampere", "Watt", "Ohm"],
        answer: "Watt",
      },
      {
        question: "Gas yang paling banyak di atmosfer bumi adalah...",
        options: ["Oksigen", "Nitrogen", "Karbon dioksida", "Argon"],
        answer: "Nitrogen",
      },
    ],
  },
  "Bahasa Indonesia": {
    dasar: [
      {
        question: "Lawan kata dari 'panjang' adalah...",
        options: ["Besar", "Pendek", "Tinggi", "Lebar"],
        answer: "Pendek",
      },
      {
        question: "Huruf vokal dalam bahasa Indonesia berjumlah...",
        options: ["3", "4", "5", "6"],
        answer: "5",
      },
      {
        question: "Kalimat tanya diakhiri dengan tanda...",
        options: ["Titik", "Koma", "Tanya", "Seru"],
        answer: "Tanya",
      },
      {
        question: "Kata 'membaca' berasal dari kata dasar...",
        options: ["Baca", "Bacaan", "Membacakan", "Terbaca"],
        answer: "Baca",
      },
      {
        question: "Sinonim dari 'pintar' adalah...",
        options: ["Malas", "Cerdas", "Lambat", "Ramah"],
        answer: "Cerdas",
      },
      {
        question: "Cerita rakyat yang tokohnya binatang disebut...",
        options: ["Legenda", "Fabel", "Mite", "Sage"],
        answer: "Fabel",
      },
      {
        question: "Penulisan nama orang yang benar adalah...",
        options: ["budi santoso", "Budi Santoso", "BUDI santoso", "budi Santoso"],
        answer: "Budi Santoso",
      },
      {
        question: "Kumpulan kalimat yang membentuk satu gagasan disebut...",
        options: ["Kata", "Frasa", "Paragraf", "Huruf"],
        answer: "Paragraf",
      },
    ],
    menengah: [
      {
        question: "Ide pokok paragraf biasanya terdapat pada...",
        options: ["Kalimat utama", "Kalimat penjelas", "Judul", "Penutup"],
        answer: "Kalimat utama",
      },
      {
        question: "Teks yang berisi langkah-langkah membuat sesuatu disebut...",
        options: ["Narasi", "Prosedur", "Deskripsi", "Eksposisi"],
        answer: "Prosedur",
      },
      {
        question: "Majas perbandingan yang menyamakan dua hal disebut...",
        options: ["Hiperbola", "Metafora", "Personifikasi", "Ironi"],
        answer: "Metafora",
      },
      {
        question: "Kata baku yang benar adalah...",
        options: ["Apotik", "Apotek", "Aptek", "Apotiek"],
        answer: "Apotek",
      },
      {
        question: "Unsur intrinsik cerpen yang menunjukkan tempat dan waktu adalah...",
        options: ["Tema", "Latar", "Alur", "Amanat"],
        answer: "Latar",
      },
      {
        question: "Kalimat efektif harus memenuhi syarat...",
        options: ["Panjang", "Hemat kata", "Berima", "Bermajas"],
        answer: "Hemat kata",
      },
      {
        question: "Antonim dari 'majemuk' adalah...",
        options: ["Tunggal", "Ganda", "Banyak", "Rangkap"],
        answer: "Tunggal",
      },
      {
        question: "Surat resmi wajib mencantumkan...",
        options: ["Emotikon", "Kop surat", "Puisi", "Gambar"],
        answer: "Kop surat",
      },
    ],
    lanjut: [
      {
        question: "Teks yang bertujuan meyakinkan pembaca disebut teks...",
        options: ["Persuasi", "Deskripsi", "Narasi", "Laporan"],
        answer: "Persuasi",
      },
      {
        question: "Struktur teks eksposisi terdiri atas tesis, argumentasi, dan...",
        options: ["Orientasi", "Penegasan ulang", "Koda", "Resolusi"],
        answer: "Penegasan ulang",
      },
      {
        question: "Kalimat 'Angin berbisik lembut' menggunakan majas...",
        options: ["Personifikasi", "Litotes", "Metonimia", "Alegori"],
        answer: "Personifikasi",
      },
      {
        question: "Karya sastra lama berbentuk empat baris bersajak a-b-a-b adalah...",
        options: ["Gurindam", "Pantun", "Syair", "Puisi bebas"],
        answer: "Pantun",
      },
      {
        question: "Bagian teks negosiasi yang berisi kesepakatan disebut...",
        options: ["Orientasi", "Pengajuan", "Persetujuan", "Penutup"],
        answer: "Persetujuan",
      },
      {
        question: "Konjungsi kausalitas contohnya adalah...",
        options: ["Karena", "Namun", "Lalu", "Atau"],
        answer: "Karena",
      },
      {
        question: "Resensi buku berisi penilaian terhadap...",
        options: ["Harga buku", "Kelebihan dan kekurangan", "Penulis saja", "Sampul saja"],
        answer: "Kelebihan dan kekurangan",
      },
      {
        question: "Kata 'analisis' merupakan serapan dari bahasa...",
        options: ["Arab", "Yunani", "Belanda", "Sanskerta"],
        answer: "Yunani",
      },
    ],
  },
  "Bahasa Inggris": {
    dasar: [
      { question: "'Buku' dalam bahasa Inggris adalah...", options: ["Book", "Bag", "Pen", "Desk"], answer: "Book" },
      {
        question: "Arti kata 'cat' adalah...",
        options: ["Anjing", "Kucing", "Burung", "Ikan"],
        answer: "Kucing",
      },
      {
        question: "'Good morning' diucapkan pada waktu...",
        options: ["Pagi", "Siang", "Sore", "Malam"],
        answer: "Pagi",
      },
      {
        question: "Angka 'seven' dalam bahasa Indonesia adalah...",
        options: ["Enam", "Tujuh", "Delapan", "Sembilan"],
        answer: "Tujuh",
      },
      {
        question: "Warna 'red' artinya...",
        options: ["Biru", "Hijau", "Merah", "Kuning"],
        answer: "Merah",
      },
      {
        question: "I ... a student.",
        options: ["am", "is", "are", "be"],
        answer: "am",
      },
      {
        question: "'Mother' artinya...",
        options: ["Ayah", "Ibu", "Kakak", "Adik"],
        answer: "Ibu",
      },
      {
        question: "Hari setelah 'Monday' adalah...",
        options: ["Sunday", "Tuesday", "Friday", "Saturday"],
        answer: "Tuesday",
      },
    ],
    menengah: [
      {
        question: "She ... to school every day.",
        options: ["go", "goes", "going", "gone"],
        answer: "goes",
      },
      {
        question: "Past tense of 'buy' is...",
        options: ["buyed", "bought", "buys", "buying"],
        answer: "bought",
      },
      {
        question: "The opposite of 'expensive' is...",
        options: ["cheap", "rich", "large", "heavy"],
        answer: "cheap",
      },
      {
        question: "They ... playing football now.",
        options: ["is", "am", "are", "be"],
        answer: "are",
      },
      {
        question: "'Library' artinya...",
        options: ["Kantin", "Perpustakaan", "Laboratorium", "Aula"],
        answer: "Perpustakaan",
      },
      {
        question: "Choose the correct plural of 'child'.",
        options: ["childs", "childes", "children", "childrens"],
        answer: "children",
      },
      {
        question: "We use 'in' before...",
        options: ["Monday", "2020", "5 o'clock", "Sunday morning"],
        answer: "2020",
      },
      {
        question: "'How old are you?' menanyakan tentang...",
        options: ["Nama", "Umur", "Alamat", "Pekerjaan"],
        answer: "Umur",
      },
    ],
    lanjut: [
      {
        question: "If I ... rich, I would travel the world.",
        options: ["am", "was", "were", "be"],
        answer: "were",
      },
      {
        question: "The passive form of 'They build a house' is...",
        options: [
          "A house is built",
          "A house builds",
          "A house was build",
          "A house is building",
        ],
        answer: "A house is built",
      },
      {
        question: "He has ... in Jakarta since 2010.",
        options: ["live", "lived", "living", "lives"],
        answer: "lived",
      },
      {
        question: "A text that tells how to do something is called...",
        options: ["Narrative", "Procedure", "Report", "Anecdote"],
        answer: "Procedure",
      },
      {
        question: "Synonym of 'enormous' is...",
        options: ["tiny", "huge", "narrow", "quick"],
        answer: "huge",
      },
      {
        question: "She asked me where I ... .",
        options: ["live", "lived", "living", "will live"],
        answer: "lived",
      },
      {
        question: "The purpose of an analytical exposition is to...",
        options: ["entertain", "persuade with arguments", "describe", "report events"],
        answer: "persuade with arguments",
      },
      {
        question: "'Despite' is followed by...",
        options: ["a clause", "a noun phrase", "a verb", "an adverb"],
        answer: "a noun phrase",
      },
    ],
  },
  PAI: {
    dasar: [
      {
        question: "Jumlah rukun Islam ada...",
        options: ["3", "4", "5", "6"],
        answer: "5",
      },
      {
        question: "Kitab suci umat Islam adalah...",
        options: ["Taurat", "Zabur", "Injil", "Al-Qur'an"],
        answer: "Al-Qur'an",
      },
      {
        question: "Sholat wajib dalam sehari semalam ada...",
        options: ["3 waktu", "4 waktu", "5 waktu", "6 waktu"],
        answer: "5 waktu",
      },
      {
        question: "Nabi terakhir umat Islam adalah...",
        options: ["Nabi Isa", "Nabi Musa", "Nabi Muhammad SAW", "Nabi Ibrahim"],
        answer: "Nabi Muhammad SAW",
      },
      {
        question: "Surah pertama dalam Al-Qur'an adalah...",
        options: ["Al-Baqarah", "Al-Fatihah", "An-Nas", "Al-Ikhlas"],
        answer: "Al-Fatihah",
      },
      {
        question: "Sebelum sholat kita harus...",
        options: ["Berwudhu", "Berlari", "Tidur", "Makan"],
        answer: "Berwudhu",
      },
      {
        question: "Ucapan sebelum memulai pekerjaan adalah...",
        options: ["Bismillah", "Alhamdulillah", "Astaghfirullah", "Subhanallah"],
        answer: "Bismillah",
      },
      {
        question: "Tempat ibadah umat Islam disebut...",
        options: ["Gereja", "Pura", "Masjid", "Vihara"],
        answer: "Masjid",
      },
    ],
    menengah: [
      {
        question: "Rukun iman berjumlah...",
        options: ["5", "6", "7", "8"],
        answer: "6",
      },
      {
        question: "Puasa Ramadhan hukumnya...",
        options: ["Sunnah", "Wajib", "Mubah", "Makruh"],
        answer: "Wajib",
      },
      {
        question: "Zakat yang dikeluarkan di akhir Ramadhan disebut zakat...",
        options: ["Mal", "Fitrah", "Profesi", "Perdagangan"],
        answer: "Fitrah",
      },
      {
        question: "Malaikat yang bertugas menyampaikan wahyu adalah...",
        options: ["Mikail", "Israfil", "Jibril", "Izrail"],
        answer: "Jibril",
      },
      {
        question: "Hijrah Nabi Muhammad SAW dari Mekah menuju...",
        options: ["Thaif", "Madinah", "Yaman", "Syam"],
        answer: "Madinah",
      },
      {
        question: "Sholat sunnah yang dikerjakan pada malam hari di bulan Ramadhan adalah...",
        options: ["Dhuha", "Tarawih", "Tahajud", "Istikharah"],
        answer: "Tarawih",
      },
      {
        question: "Sifat wajib bagi Rasul yang berarti jujur adalah...",
        options: ["Amanah", "Shiddiq", "Tabligh", "Fathanah"],
        answer: "Shiddiq",
      },
      {
        question: "Kiblat umat Islam adalah...",
        options: ["Masjid Nabawi", "Ka'bah", "Masjidil Aqsa", "Jabal Nur"],
        answer: "Ka'bah",
      },
    ],
    lanjut: [
      {
        question: "Ilmu tentang tata cara membaca Al-Qur'an disebut...",
        options: ["Tafsir", "Tajwid", "Fiqih", "Tauhid"],
        answer: "Tajwid",
      },
      {
        question: "Sumber hukum Islam yang kedua setelah Al-Qur'an adalah...",
        options: ["Ijma", "Qiyas", "Hadis", "Fatwa"],
        answer: "Hadis",
      },
      {
        question: "Perjanjian damai antara kaum muslimin dan Quraisy dikenal sebagai...",
        options: [
          "Perjanjian Aqabah",
          "Perjanjian Hudaibiyah",
          "Piagam Madinah",
          "Fathu Makkah",
        ],
        answer: "Perjanjian Hudaibiyah",
      },
      {
        question: "Khalifah pertama setelah Rasulullah wafat adalah...",
        options: ["Umar bin Khattab", "Abu Bakar Ash-Shiddiq", "Utsman bin Affan", "Ali bin Abi Thalib"],
        answer: "Abu Bakar Ash-Shiddiq",
      },
      {
        question: "Sikap tidak berlebih-lebihan dalam beragama disebut...",
        options: ["Wasathiyah", "Ghuluw", "Taqlid", "Bid'ah"],
        answer: "Wasathiyah",
      },
      {
        question: "Haji dilaksanakan pada bulan...",
        options: ["Muharram", "Rajab", "Dzulhijjah", "Sya'ban"],
        answer: "Dzulhijjah",
      },
      {
        question: "Ilmu yang membahas keesaan Allah disebut...",
        options: ["Tauhid", "Akhlak", "Fiqih", "Sirah"],
        answer: "Tauhid",
      },
      {
        question: "Larangan memakan harta orang lain secara batil terdapat dalam...",
        options: ["Al-Qur'an", "Kalender", "Silsilah", "Syair"],
        answer: "Al-Qur'an",
      },
    ],
  },
  Umum: {
    dasar: [
      {
        question: "Ibu kota Indonesia adalah...",
        options: ["Bandung", "Jakarta", "Surabaya", "Medan"],
        answer: "Jakarta",
      },
      {
        question: "Warna bendera Indonesia adalah...",
        options: ["Merah Putih", "Merah Biru", "Putih Hijau", "Biru Putih"],
        answer: "Merah Putih",
      },
      {
        question: "Lambang negara Indonesia adalah...",
        options: ["Komodo", "Garuda Pancasila", "Harimau", "Elang Jawa"],
        answer: "Garuda Pancasila",
      },
      {
        question: "Hari Kemerdekaan Indonesia diperingati setiap tanggal...",
        options: ["17 Agustus", "1 Juni", "10 November", "28 Oktober"],
        answer: "17 Agustus",
      },
      {
        question: "Jumlah sila dalam Pancasila adalah...",
        options: ["3", "4", "5", "6"],
        answer: "5",
      },
      {
        question: "Alat transportasi yang berjalan di rel adalah...",
        options: ["Bus", "Kereta api", "Kapal", "Pesawat"],
        answer: "Kereta api",
      },
      {
        question: "Mata uang Indonesia adalah...",
        options: ["Ringgit", "Rupiah", "Peso", "Baht"],
        answer: "Rupiah",
      },
      {
        question: "Pulau terbesar di Indonesia adalah...",
        options: ["Jawa", "Kalimantan", "Sulawesi", "Bali"],
        answer: "Kalimantan",
      },
    ],
    menengah: [
      {
        question: "Presiden pertama Republik Indonesia adalah...",
        options: ["Soeharto", "Ir. Soekarno", "B.J. Habibie", "Moh. Hatta"],
        answer: "Ir. Soekarno",
      },
      {
        question: "Sumpah Pemuda diikrarkan pada tahun...",
        options: ["1908", "1928", "1945", "1966"],
        answer: "1928",
      },
      {
        question: "Benua terluas di dunia adalah...",
        options: ["Afrika", "Asia", "Amerika", "Eropa"],
        answer: "Asia",
      },
      {
        question: "Organisasi negara-negara Asia Tenggara disebut...",
        options: ["ASEAN", "PBB", "OKI", "NATO"],
        answer: "ASEAN",
      },
      {
        question: "Candi Borobudur terletak di provinsi...",
        options: ["Jawa Timur", "Jawa Tengah", "DI Yogyakarta", "Jawa Barat"],
        answer: "Jawa Tengah",
      },
      {
        question: "Lagu 'Indonesia Raya' diciptakan oleh...",
        options: ["Ismail Marzuki", "W.R. Supratman", "C. Simanjuntak", "Kusbini"],
        answer: "W.R. Supratman",
      },
      {
        question: "Gunung tertinggi di dunia adalah...",
        options: ["K2", "Everest", "Kilimanjaro", "Semeru"],
        answer: "Everest",
      },
      {
        question: "Danau terbesar di Indonesia adalah...",
        options: ["Danau Toba", "Danau Poso", "Danau Sentani", "Danau Maninjau"],
        answer: "Danau Toba",
      },
    ],
    lanjut: [
      {
        question: "Lembaga negara yang berwenang menguji undang-undang terhadap UUD adalah...",
        options: ["MPR", "Mahkamah Konstitusi", "DPR", "Mahkamah Agung"],
        answer: "Mahkamah Konstitusi",
      },
      {
        question: "Inflasi adalah kondisi...",
        options: [
          "Harga barang naik secara umum",
          "Harga barang turun",
          "Nilai uang naik",
          "Produksi berhenti",
        ],
        answer: "Harga barang naik secara umum",
      },
      {
        question: "Konferensi Asia Afrika 1955 diselenggarakan di kota...",
        options: ["Jakarta", "Bandung", "Yogyakarta", "Surabaya"],
        answer: "Bandung",
      },
      {
        question: "Sistem pemerintahan Indonesia saat ini adalah...",
        options: ["Parlementer", "Presidensial", "Monarki", "Federal"],
        answer: "Presidensial",
      },
      {
        question: "Perserikatan Bangsa-Bangsa berdiri pada tahun...",
        options: ["1919", "1945", "1955", "1960"],
        answer: "1945",
      },
      {
        question: "Selat yang memisahkan Sumatra dan Jawa adalah...",
        options: ["Selat Sunda", "Selat Bali", "Selat Malaka", "Selat Madura"],
        answer: "Selat Sunda",
      },
      {
        question: "Politik luar negeri Indonesia dikenal dengan istilah...",
        options: ["Bebas aktif", "Netral pasif", "Blok Timur", "Non intervensi"],
        answer: "Bebas aktif",
      },
      {
        question: "Sumber energi terbarukan contohnya adalah...",
        options: ["Batu bara", "Minyak bumi", "Tenaga surya", "Gas alam"],
        answer: "Tenaga surya",
      },
    ],
  },
};

function levelFor(classNumber: number): Level {
  if (classNumber <= 6) return "dasar";
  if (classNumber <= 9) return "menengah";
  return "lanjut";
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Membuat tepat `count` soal cadangan untuk mata pelajaran & kelas tertentu. */
export function getFallbackQuestions(
  subject: Subject,
  classNumber: number,
  count: number,
): QuizQuestion[] {
  const level = levelFor(classNumber);
  const bySubject = BANK[subject] ?? BANK.Umum;
  const pool = [...bySubject[level], ...bySubject.dasar, ...bySubject.menengah, ...bySubject.lanjut];

  const unique: QuizQuestion[] = [];
  const seen = new Set<string>();
  for (const q of shuffle(pool)) {
    if (seen.has(q.question)) continue;
    seen.add(q.question);
    unique.push(q);
  }

  const result: QuizQuestion[] = [];
  let i = 0;
  while (result.length < count) {
    const base = unique[i % unique.length];
    result.push({ ...base, options: shuffle(base.options) });
    i++;
  }
  return result.slice(0, count);
}
