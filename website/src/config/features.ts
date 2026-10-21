import { FiSearch, FiTarget, FiHeadphones } from "react-icons/fi";
import type { Feature } from "./types";

export const features: Feature[] = [
  {
    title: "Cari Ayat dari Ingatanmu",
    description:
      "Temukan ayat Al-Qur’an hanya dari lafaz latin atau kata kunci terjemahan Indonesia yang masih kamu ingat.",
    icon: FiSearch,
  },
  {
    title: "Toleran Typo & Ingatan Samar",
    description:
      "Meski ejaan kurang tepat, Cari Ayat menggunakan fuzzy search dan skor kemiripan untuk menampilkan ayat yang paling mendekati.",
    icon: FiTarget,
  },
  {
    title: "Baca & Dengarkan dengan Nyaman",
    description:
      "Lihat teks Arab, transliterasi latin, terjemahan Indonesia, dan dengarkan audio bacaan ayat dalam tampilan yang sederhana dan mudah digunakan.",
    icon: FiHeadphones,
  },
];
