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
      "Ya, aplikasi Cari Ayat dapat diunduh dan digunakan secara gratis. Fitur utama seperti pencarian berdasarkan lafaz dan terjemahan, penilaian kemiripan hasil, penyorotan lafaz, dan tampilan teks ayat dapat diakses tanpa biaya. Beberapa fitur tambahan seperti pemutaran audio mungkin membutuhkan koneksi internet.",
  },
];
