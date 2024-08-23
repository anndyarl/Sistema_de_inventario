import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://sidra.ssmso.cl', // El dominio de tu API
        changeOrigin: true, // Cambia el origen del host en el encabezado de la solicitud
        secure: true, // Si la API usa HTTPS, debes ponerlo en true; en false solo para HTTP
        rewrite: (path) => path.replace(/^\/api/, ''), // Reescribe la ruta para eliminar el prefijo /api
      },
    },
  },
});
