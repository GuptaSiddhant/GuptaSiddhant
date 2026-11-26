import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["html", "text"],
    },
  },
});
