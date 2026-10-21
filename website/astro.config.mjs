import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// Custom domain. base stays "/" so asset and page paths are not prefixed.
// https://cariayat.naandalist.com
export default defineConfig({
  site: "https://cariayat.naandalist.com",
  output: "static",
  integrations: [tailwind(), react()],
});
