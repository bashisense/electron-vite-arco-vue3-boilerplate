
## 1. 创建electron-vite项目
1. 准备环境
npm i electron-vite -D

2. 创建项目
npm create @quick-start/electron


## 2. 创建arco.design项目
1. 准备环境
npm i -g arco-cli

2. 进入electron-vite项目
cd your-electron-vite-project-dir/src
mv renderer renderer.org

3. 创建项目
arco init renderer
> 务必使用renderer为项目名，electron-vite对此有依赖，如果不用这个默认名，需要自己调整脚本

## 3. 修改构建脚本
1. 解决@开始的库引用问题
复制src/renderer/config/vite.config.base.ts中的内容到electron.vite.config.ts
```typescript
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

```

修改tsconfig.web.json文件，添加path信息，同时添加忽略非使用变量告警开关
```json
{
  "extends": "@electron-toolkit/tsconfig/tsconfig.web.json",
  "include": [
    "src/renderer/src/env.d.ts",
    "src/renderer/src/**/*",
    "src/renderer/src/**/*.vue",
    "src/preload/*.d.ts"
  ],
  "compilerOptions": {
    "composite": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "baseUrl": ".",
    "paths": {
      "@renderer/*": [
        "src/renderer/src/*"
      ],
      "@/*":["src/renderer/src/*"]
    }
  }
}
```


2. 解决包引用问题
复制 src/renderer/package.json至package.json并删除得复
```json
{
  "name": "okra",
  "version": "1.0.0",
  "description": "An Electron application with Vue and TypeScript",
  "main": "./out/main/index.js",
  "author": "example.com",
  "homepage": "https://www.electronjs.org",
  "scripts": {
    "format": "prettier --write .",
    "lint": "eslint . --ext .js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts,.vue --fix",
    "typecheck:node": "tsc --noEmit -p tsconfig.node.json --composite false",
    "typecheck:web": "vue-tsc --noEmit -p tsconfig.web.json --composite false",
    "typecheck": "npm run typecheck:node && npm run typecheck:web",
    "start": "electron-vite preview",
    "dev": "electron-vite dev",
    "build": "npm run typecheck && electron-vite build",
    "postinstall": "electron-builder install-app-deps",
    "build:win": "npm run build && electron-builder --win --config",
    "build:mac": "npm run build && electron-builder --mac --config",
    "build:linux": "npm run build && electron-builder --linux --config"
  },
  "dependencies": {
    "@electron-toolkit/preload": "^2.0.0",
    "@electron-toolkit/utils": "^2.0.0",
    "electron-updater": "^6.1.1",

    "@arco-design/web-vue": "^2.44.7",
    "@vueuse/core": "^9.3.0",
    "arco-design-pro-vue": "^2.7.2",
    "axios": "^0.24.0",
    "dayjs": "^1.11.5",
    "echarts": "^5.4.0",
    "lodash": "^4.17.21",
    "mitt": "^3.0.0",
    "nprogress": "^0.2.0",
    "pinia": "^2.0.23",
    "query-string": "^8.0.3",
    "sortablejs": "^1.15.0",
    "vue": "^3.2.40",
    "vue-echarts": "^6.2.3",
    "vue-i18n": "^9.2.2",
    "vue-router": "^4.0.14"
  },
  "devDependencies": {
    "@electron-toolkit/eslint-config": "^1.0.1",
    "@electron-toolkit/eslint-config-ts": "^1.0.0",
    "@electron-toolkit/tsconfig": "^1.0.1",
    "@rushstack/eslint-patch": "^1.3.3",
    "@types/node": "^18.17.5",
    "@vitejs/plugin-vue": "^4.3.1",
    "@vue/eslint-config-prettier": "^8.0.0",
    "@vue/eslint-config-typescript": "^11.0.3",
    "electron": "^25.6.0",
    "electron-builder": "^24.6.3",
    "electron-vite": "^1.0.27",
    "eslint": "^8.47.0",
    "eslint-plugin-vue": "^9.17.0",
    "less": "^4.2.0",
    "prettier": "^3.0.2",
    "typescript": "^5.1.6",
    "vite": "^4.5.0",
    "vue": "^3.3.4",
    "vue-tsc": "^1.8.8",

    "@arco-plugins/vite-vue": "^1.4.5",
    "@commitlint/cli": "^17.1.2",
    "@commitlint/config-conventional": "^17.1.0",
    "@types/lodash": "^4.14.186",
    "@types/mockjs": "^1.0.7",
    "@types/nprogress": "^0.2.0",
    "@types/sortablejs": "^1.15.0",
    "@typescript-eslint/eslint-plugin": "^5.40.0",
    "@typescript-eslint/parser": "^5.40.0",
    "@vitejs/plugin-vue-jsx": "^3.1.0",
    "@vue/babel-plugin-jsx": "^1.1.1",
    "consola": "^2.15.3",
    "cross-env": "^7.0.3",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-import-resolver-typescript": "^3.5.1",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-prettier": "^4.2.1",
    "husky": "^8.0.1",
    "lint-staged": "^13.0.3",
    "mockjs": "^1.1.0",
    "postcss-html": "^1.5.0",
    "rollup": "^3.9.1",
    "rollup-plugin-visualizer": "^5.8.2",
    "stylelint": "^14.13.0",
    "stylelint-config-prettier": "^9.0.3",
    "stylelint-config-rational-order": "^0.1.2",
    "stylelint-config-recommended-vue": "^1.4.0",
    "stylelint-config-standard": "^29.0.0",
    "stylelint-order": "^5.0.0",
    "unplugin-vue-components": "^0.24.1",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-eslint": "^1.8.1",
    "vite-plugin-imagemin": "^0.6.1",
    "vite-svg-loader": "^3.6.0"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "resolutions": {
    "bin-wrapper": "npm:bin-wrapper-china",
    "rollup": "^2.56.3",
    "gifsicle": "5.2.0"
  }
}
```

3. arco.design修改文件
src/renderer/src/views/profile/basic/components/profile-item.vue
声明的result需要添加类型为any(58行)
```typescript
const result:any = [];
```


## 4. 构建项目

1. 安装module 
npm install

2. 测试
npm run dev

3. 打包
npm run build:mac
npm run build:linux
npm run build:windows

