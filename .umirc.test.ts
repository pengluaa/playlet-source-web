import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    ENV: 'test',
    BASE_API: 'http://example.com',
    FILE_URL: 'http://example.com',
  },
});
