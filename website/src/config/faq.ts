import type { FAQ } from "./types";

export const faq: FAQ[] = [
  {
    question: "Apa itu aplikasi Cari Ayat?",
    answer:
      "Cari Ayat adalah aplikasi yang membantu kamu menemukan ayat Al-Qur’an hanya dari lafaz latin atau kata kunci terjemahan bahasa Indonesia yang masih kamu ingat. Aplikasi ini menggunakan pencarian dengan toleransi typo (fuzzy search) sehingga tetap bisa menemukan ayat meski ejaanmu belum sempurna.",
  },
  {
    question: "Bagaimana cara mencari ayat dengan aplikasi ini?",
    answer:
      "Pada halaman utama, ketik lafaz latin atau kata kunci terjemahan Indonesia di kolom kata kunci, lalu pilih mode pencarian yang sesuai: Lafaz (latin) atau Terjemahan (Indonesia). Setelah menekan tombol Cari, aplikasi akan menampilkan daftar ayat yang paling mendekati, lengkap dengan teks Arab, transliterasi, terjemahan, skor kemiripan, dan opsi untuk membuka detail ayat.",
  },
  {
    question: "Apakah aplikasi Cari Ayat gratis?",
    answer:
      "Ya, aplikasi Cari Ayat dapat diunduh dan digunakan secara gratis. Fitur utama seperti pencarian berdasarkan lafaz dan terjemahan, penilaian kemiripan hasil, penyorotan lafaz, dan tampilan teks ayat dapat diakses tanpa biaya. Aplikasi menampilkan iklan di beberapa layar. Mengetuk iklan ditangani oleh Google, bukan oleh pemasang aplikasi di dalam Cari Ayat. Beberapa fitur tambahan seperti pemutaran audio dan penayangan iklan membutuhkan koneksi internet.",
  },
  {
    question: "Berapa usia minimum untuk menggunakan Cari Ayat?",
    answer:
      "Cari Ayat ditujukan untuk pengguna berusia 13 tahun ke atas. Pembatasan ini terutama karena aplikasi menampilkan iklan dari Google AdMob, dan isi iklan dari pihak ketiga tidak selalu ramah untuk anak-anak. Anak-anak tetap bisa menggunakan aplikasi ini dalam mode offline (tanpa koneksi internet): iklan tidak akan muncul dan fitur pencarian ayat tetap berfungsi, hanya saja fitur pemutaran audio bacaan ayat tidak dapat digunakan. Anak-anak sebaiknya menggunakannya dengan pendampingan orang tua/wali, dan pengguna berusia 13–17 tahun juga disarankan untuk tetap didampingi.",
  },
  {
    question: "Apakah Cari Ayat menampilkan iklan?",
    answer:
      "Ya. Iklan dari Google AdMob dapat muncul di beranda, hasil pencarian, dan riwayat pencarian, dan ditandai dengan label Iklan agar terpisah dari teks ayat. Isi iklan berasal dari pengiklan pihak ketiga. Rincian ada di Syarat dan Ketentuan serta Kebijakan Privasi.",
  },
];
