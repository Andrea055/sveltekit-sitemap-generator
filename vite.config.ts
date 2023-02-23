import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "plugin.ts",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "plugin.mjs" : "plugin.cjs"),
    },
    rollupOptions: {
      external: ["path", "fs", "fs/promises", "url"],
    },
    target: "esnext",
    minify: false,
  },
  plugins: [dts()],
});
