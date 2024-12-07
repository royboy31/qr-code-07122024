import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
          'qr-vendor': ['qrcode']
        }
      }
    }
  },
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "frame-ancestors *; default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; frame-ancestors *;",
      'X-Frame-Options': 'ALLOWALL'
    }
  }
});