// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import vue from "@astrojs/vue";
// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "DM Sans",
      cssVariable: "--font-family-base",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Playfair Display",
      cssVariable: "--font-family-secondary",
    },
  ],
  integrations: [vue()],
});
