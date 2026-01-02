import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'esnext',
        outDir: 'build',
        ssr: true, // Important for Node.js apps
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
});
