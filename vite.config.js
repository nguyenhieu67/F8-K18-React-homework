import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "/F8-K18-React-homework/",
    server: {
        proxy: {
            "/api": {
                target: "https://k305jhbh09.execute-api.ap-southeast-1.amazonaws.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
