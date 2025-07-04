import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: ['content', 'src', 'static', '.svelte-kit', 'node_modules']
    }
  }
});
