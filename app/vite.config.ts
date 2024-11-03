import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";

const envVars = [
  "VITE_AUTH0_DOMAIN",
  "VITE_AUTH0_CLIENT_ID",
  "VITE_AUTH0_REDIRECT_URI",
  "VITE_AUTH0_AUDIENCE",
];

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  const define = {};
  for (const envVar of envVars) {
    if (env[envVar]) {
      define[envVar] = JSON.stringify([envVar]);
    }
  }

  return {
    optimizeDeps: {
      include: ["@emotion/react", "@emotion/styled", "@mui/material/Tooltip"],
    },
    plugins: [react(), mkcert()],
    server: {
      https: true,
      proxy: {
        "/api": {
          target: "http://localhost:9000",
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    define,
  };
});
