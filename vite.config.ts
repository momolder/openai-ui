import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';

export default defineConfig(() => {
  return {
    plugins: [sveltekit(), nodeLoaderPlugin()],
    server: {
      port: 3000
    }
  };
});
