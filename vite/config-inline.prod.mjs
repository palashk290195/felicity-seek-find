import { config } from '../src/config.js';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import { htmlInjectionPlugin } from 'vite-plugin-html-injection';
import { viteSingleFile } from 'vite-plugin-singlefile';
import viteString from 'vite-plugin-string';
import zipPack from 'vite-plugin-zip-pack';

const addNetworkInjection = () => {
    switch (config.adNetworkType) {
      case "google":
        return {
          name: "Google Ads",
          type: "raw", // raw | js | css
          path: "./src/injections/google.html",
          injectTo: "head" // head | body | head-prepend | body-prepend
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
  build: {
      outDir: 'dist-inline',
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
      viteSingleFile({ removeViteModuleLoader: false }),
      viteString({
          compress: false,
          include: [ "**/*.atlas", "**/*.xml" ]
      }),
      zipPack({
        inDir: 'dist-inline',
        outDir: 'dist-inline',
        outFileName: 'index.zip'
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