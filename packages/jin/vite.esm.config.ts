import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
    return {
        build: {
            lib: {
                entry: resolve(__dirname, './src/plugin/output/es-entry.ts'),
                name: 'pluginManager',
                formats: ['es'],
                fileName: () => `index.es.js`,
            },
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
        },
    };
});