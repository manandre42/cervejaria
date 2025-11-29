import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate", // atualiza automaticamente
        manifest: {
          id: "/cervejaria/", //sasa <-- define o ID explícito
          name: "Gestor Cerveja Pro",
          short_name: "GestorCerveja",
          description:
            "Aplicação simples e moderna para gestão de vendas de cerveja, controle de vasilhames, kilapis (dívidas) e consultoria de crescimento via IA.",
          theme_color: "#020452",
          background_color: "#ffffff",
          display: "standalone",
          start_url: "/cervejaria/",
          orientation: "portrait",
          icons: [
            {
              src: "logo24.png",
              sizes: "24x14",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "logo64.png",
              sizes: "64x64",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "logo128.png",
              sizes: "128x128",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "logo256.png",
              sizes: "256x256",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "logo512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
    base: "/cervejaria/", // <-- troque pelo nome do seu repositório GitHub Pages
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
