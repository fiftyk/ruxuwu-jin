import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
    return {
        build: {
            lib: {
                entry: resolve(__dirname, './src/plugin/output/es-entry.ts'),
                name: '__ruxuwu__',
                formats: ['cjs'], // IIFE 格式
                fileName: () => `index.cjs.js`,
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