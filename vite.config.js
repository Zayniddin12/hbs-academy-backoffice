import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export default defineConfig({
    base: "/",
    plugins: [
        vue(),
        eslintPlugin(),
        ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "~": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
//# sourceMappingURL=vite.config.js.map