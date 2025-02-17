import { defineConfig } from 'vite';
import viteString from 'vite-plugin-string';

const adNetworkType = process.env.AD_NETWORK || 'applovin';
const language = process.env.LANGUAGE || 'en';

export default defineConfig({
    define: {
        'process.env.AD_NETWORK': JSON.stringify(adNetworkType),
        'process.env.LANGUAGE': JSON.stringify(language)
    },
    build: {
        assetsInlineLimit: 2097152,
        sourcemap: false
    },
    server: {
        port: 8080
    },
    plugins: [
        viteString({
            compress: false,
            include: [ "**/*.atlas", "**/*.xml" ] // This will inline all Spine Atlas files and XML files as strings
        })
    ]
});
