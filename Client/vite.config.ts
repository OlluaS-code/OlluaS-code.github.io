import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/",

  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        contato: resolve(__dirname, "contato.html"),
        projetos: resolve(__dirname, "projetos.html"),
        sobre: resolve(__dirname, "sobre.html"),
        obrigado: resolve(__dirname, "obrigado.html"),
      },
    },
  },
});
