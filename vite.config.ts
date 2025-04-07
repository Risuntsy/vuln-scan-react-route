import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const env = loadEnv(process.env.NODE_ENV || "dev", process.cwd(), "");

const REAL_BACKEND_URL = env.API_BASE_URL;
const FRONTEND_SERVER_URL = env.FRONTEND_SERVER_URL;

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  define: {
    "process.env.API_BASE_URL": JSON.stringify(REAL_BACKEND_URL),
    "process.env.FRONTEND_SERVER_URL": JSON.stringify(FRONTEND_SERVER_URL)
  }
});
