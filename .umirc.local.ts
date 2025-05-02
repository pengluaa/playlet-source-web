import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    ENV: 'local',
    BASE_API: 'http://api.dev.me',
    FILE_URL: 'http://file.dev.me',
  },
});
