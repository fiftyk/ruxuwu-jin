// vite.umd.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: './src/plugin/index.ts',
            name: '__ruxuwu__',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'cjs', 'umd'], // 同时输出 ESM、CommonJS 和 UMD
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: [],
            output: {
                globals: {
                    // 在这里定义全局变量
                    vue: 'Vue', // 如果使用 Vue，请确保定义
                },
            },
        },
    },
});