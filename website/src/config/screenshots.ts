import type { DeviceScreenshots } from "./types";
import phone1 from "../assets/phone_1.png";
import phone2 from "../assets/phone_2.png";
import phone3 from "../assets/phone_3.png";
import phone4 from "../assets/phone_4.png";
import tablet1 from "../assets/tablet_1.jpeg";
import tablet2 from "../assets/tablet_2.jpeg";
import tablet3 from "../assets/tablet_3.jpeg";

export const screenshots: DeviceScreenshots = {
	android: [phone1.src, phone2.src, phone3.src, phone4.src],
	tablet: [tablet1.src, tablet2.src, tablet3.src],
};
