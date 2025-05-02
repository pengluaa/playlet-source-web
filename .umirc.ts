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
