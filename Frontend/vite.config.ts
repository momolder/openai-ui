import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [sveltekit()],
    server: {
      // proxy: {
      //   '^/api/.*': 'http://localhost:5000'
      // }
    }
  };
});
