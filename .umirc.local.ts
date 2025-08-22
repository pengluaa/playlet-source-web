import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    ENV: 'local',
    PWD_SALT: '6913c8ba8f1cd48284a207c63d632364',
    BASE_API: 'http://api.dev.me',
    FILE_URL: 'http://file.dev.me',
  },
});
