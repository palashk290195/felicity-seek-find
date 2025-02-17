import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import { htmlInjectionPlugin } from 'vite-plugin-html-injection';
import viteString from 'vite-plugin-string';
import zipPack from 'vite-plugin-zip-pack';

const adNetworkType = process.env.AD_NETWORK || 'default';
const language = process.env.LANGUAGE || 'en';

const addNetworkInjection = () => {
    switch (adNetworkType) {
      case "google":
        return {
          name: "Google Ads",
          type: "raw",
          path: "./src/injections/google.html",
          injectTo: "head"
        };
      case "tiktok":
        return {
          name: "TikTok",
          type: "raw",
          path: "./src/injections/tiktok.html",
          injectTo: "head"
        };
      case "ironsource":
        return {
          name: "IronSource",
          type: "raw",
          path: "./src/injections/ironsource.html",
          injectTo: "head"
        };
      case "mintegral":
        return {
          name: "Mintegral",
          type: "raw",
          path: "./src/injections/mintegral.html",
          injectTo: "head"
        };
      case "mraid":
        return {
          name: "Mraid",
          type: "raw",
          path: "./src/injections/mraid.html",
          injectTo: "head"
        };
      case "unityads":
        return {
          name: "Unity Ads",
          type: "raw",
          path: "./src/injections/mraid.html",
          injectTo: "head"
        };
      case "adcolony":
        return {
          name: "Ad Colony",
          type: "raw",
          path: "./src/injections/mraid.html",
          injectTo: "head"
        };
      case "applovin":
        return {
          name: "Ad Colony",
          type: "raw",
          path: "./src/injections/mraid.html",
          injectTo: "head"
        };
      case "kayzen":
        return {
          name: "Kayzen",
          type: "raw",
          path: "./src/injections/mraid.html",
          injectTo: "head"
        };
      default:
        return {
          name: "default",
          type: "raw",
          path: "./src/injections/blank.html",
          injectTo: "head"
        };
    }
};
  
export default defineConfig({
    base: '',
    logLevel: 'warning',
    publicDir: false,
    define: {
      'process.env.AD_NETWORK': JSON.stringify(adNetworkType),
      'process.env.LANGUAGE': JSON.stringify(language)
    },
    build: {
      outDir: `dist-split-${adNetworkType}-${language}`,
      assetsInlineLimit: 2097152,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
          format: {
              comments: false
          }
      }
    },
    server: {
        port: 8080
    },
    plugins: [
        createHtmlPlugin({
            minify: false,
            removeComments: true,
            entry: "src/main.js",
        }),
        viteString({
            compress: false,
            include: [ "**/*.atlas", "**/*.xml" ]
        }),
        zipPack({
          inDir: `dist-split-${adNetworkType}-${language}`,
          outDir: `dist-split-${adNetworkType}-${language}`,
        }),
        {
            ...htmlInjectionPlugin({
              injections: [
                addNetworkInjection(),
              ],
            }),
            apply: "build"
          }
    ]
});