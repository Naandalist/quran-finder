import type { AppLogo, StoreLinks } from "./types";

export const appInfo = {
	title: "Cari Ayat - Al-Qur'an",
	description:
		"Aplikasi untuk menemukan ayat Al-Qur'an meski ada typo atau hanya mengingatnya samar-samar.",
	logo: {
		type: "image" as AppLogo["type"],
		src: "/cariayat-icon.webp",
	},
	storeLinks: {
		apple: "#",
		google: "https://play.google.com/store/apps/details?id=com.naandalist.quran_finder",
	} as StoreLinks,
};
