import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/chemical_manager/" : "/",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Chemical Manager",
        short_name: "ChemManager",
        description: "Manage your chemical supplies efficiently.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/chemical-flask.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "chemical management",
          },
        ],
      },
    }),
  ],
});
