import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
    return {
        build: {
            lib: {
                entry: resolve(__dirname, './src/plugin/output/umd-entry.ts'),
                name: '__ruxuwu__',
                formats: ['iife'], // IIFE 格式
                fileName: () => `index.iife.js`,
            },
            rollupOptions: {
                output: {
                    globals: {
                        vue: 'Vue', // 如果有依赖，定义全局变量
                    },
                },
            },
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode), // 设置环境变量
        },
    };
}); 