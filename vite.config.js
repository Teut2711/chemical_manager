import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/chemical_manager/" : "/",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: [
        {
          icons: [{ type: "image/png", name: "chemical-flask.png" , size:"512X512"}],
        },
      ],
    }),
  ],
});
