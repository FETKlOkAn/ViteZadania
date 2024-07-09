import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loaders: {
      '.js': 'jsx', // Enable JSX syntax for JavaScript files
    },
  },
});
