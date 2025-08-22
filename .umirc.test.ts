import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    ENV: 'test',
    PWD_SALT: '6913c8ba8f1cd48284a207c63d632364',
    BASE_API: 'http://example.com',
    FILE_URL: 'http://example.com',
  },
});
