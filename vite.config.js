import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/chemical_manager/" : "/",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        icons: [
          {
            src: "chemical-flask.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
        screenshots: [
          {
 
            src: "chemical-flask.png",
            sizes: "512X512",
            type: "image/png",
            label: "Chemical Manager",
          },
        ],
      },
    }),
  ],
});
