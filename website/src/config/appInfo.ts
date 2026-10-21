import type { AppLogo, StoreLinks } from "./types";

export const appInfo = {
	title: "Cari Ayat - Al-Qur'an",
	description:
		"Cari ayat Al-Qur'an dari lafaz latin atau terjemahan Indonesia, meski salah ketik. Baca teks Arab dan dengarkan audio ayat. Unduh gratis di Android.",
	logo: {
		type: "image" as AppLogo["type"],
		src: "/cariayat-icon.webp",
	},
	storeLinks: {
		apple: "#",
		google: "https://play.google.com/store/apps/details?id=com.naandalist.quran_finder",
	} as StoreLinks,
};
