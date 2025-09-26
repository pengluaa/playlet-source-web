import { defineConfig } from 'umi';

export default defineConfig({
  title: '平台管理Test',
  define: {
    ENV: 'test',
    PWD_SALT: '6913c8ba8f1cd48284a207c63d632364',
    BASE_API: 'http://api.playetsource.me',
    FILE_URL: 'http://file.playetsource.me',
  },
});
