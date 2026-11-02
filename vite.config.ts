import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/howler')) return 'audio';
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion'))
            return 'motion';
        },
      },
    },
  },
});
