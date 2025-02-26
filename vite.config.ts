import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    // proxy: {     
    //   '/api_inv': {
    //     target: 'https://sidra.ssmso.cl/api_erp_inv_qa',// Utiliza process.env para acceder a la variable de entorno
    //    changeOrigin: true, // Cambia el origen del host en el encabezado de la solicitud
    //    secure: true, // Si la API usa HTTPS, debes ponerlo en true; en false solo para HTTP
    //    rewrite: (path) => path.replace(/^\/api_inv/, ''), // Reescribe la ruta para eliminar el prefijo /api
    //  },
     proxy: {     
      '/api_inv': {
        target: 'http://localhost:5076/api_erp_inv_qa',// Utiliza process.env para acceder a la variable de entorno
       changeOrigin: true, // Cambia el origen del host en el encabezado de la solicitud
       secure: true, // Si la API usa HTTPS, debes ponerlo en true; en false solo para HTTP
       rewrite: (path) => path.replace(/^\/api_inv/, ''), // Reescribe la ruta para eliminar el prefijo /api
     },
     
      '/api': {
         target: 'https://sidra.ssmso.cl/Api_Erp_Qa',// process.env.VITE_CSRF_DOMAIN, // Utiliza process.env para acceder a la variable de entorno
        changeOrigin: true, // Cambia el origen del host en el encabezado de la solicitud
        secure: true, // Si la API usa HTTPS, debes ponerlo en true; en false solo para HTTP
        rewrite: (path) => path.replace(/^\/api/, ''), // Reescribe la ruta para eliminar el prefijo /api
      },    

      '/claveunica': {
        target: 'https://sidra.ssmso.cl/wcf_claveunica/?url_solicitud=https://sidra.ssmso.cl/api_erp_inv_qa/api/claveunica/validarportal/', // URL del servidor para la ruta /auth
        changeOrigin: true,
        secure: true,    
      },
     
    },
    port:3002
  },
  build: {
    sourcemap: true,  // Habilitar source maps en la construcción
   
  },
  define: {
    'process.env': process.env,
  },
 
});


