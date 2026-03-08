import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "yyvr6g",
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
