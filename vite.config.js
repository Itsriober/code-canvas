import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['frontend/src/main.tsx'],
            refresh: true,
            buildDirectory: 'build'
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/frontend/src',
        },
    },
    build: {
        outDir: 'public/build',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: {
                    'monaco': ['monaco-editor'],
                },
            },
        },
    },
    optimizeDeps: {
        include: ['monaco-editor'],
    },
});
