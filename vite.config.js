import { defineConfig } from 'vite';
import { ripple } from '@ripple-ts/vite-plugin';

export default defineConfig({
	plugins: [ripple()],
	server: {
		port: 3000
	},
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'], // Prevents bundling issues
  },
});
