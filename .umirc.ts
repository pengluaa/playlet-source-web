import { defineConfig } from 'umi';

import themes from './src/themes/var';

export default defineConfig({
  npmClient: 'pnpm',
  title: 'admin',
  outputPath: 'cms',
  theme: themes,
  cssLoaderModules: {
    exportLocalsConvention: 'camelCase',
  },
  define: {
    ENV: 'prod',
    PWD_SALT: '6913c8ba8f1cd48284a207c63d632364',
    BASE_API: 'http://example.com',
    FILE_URL: 'http://example.com',
  },
  conventionRoutes: {
    exclude: [
      /\/components\//, // components
      /^_.*/, // "_example"
      /\/_.*/, //another/_example
    ],
  },
});
