import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import configArcoStyleImportPlugin from './src/renderer/config/plugin/arcoStyleImport';
 
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [
      vue(),
      vueJsx(),
      svgLoader({ svgoConfig: {} }),
      configArcoStyleImportPlugin(),
    ],
    resolve: {
      alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src/renderer/src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, './src/renderer/src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
      ],
      extensions: ['.ts', '.js'],
    },
    define: {
      'process.env': {},
    },
    css: {
      preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            './src/renderer/src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true,
      },
      },
    },
  }
})
