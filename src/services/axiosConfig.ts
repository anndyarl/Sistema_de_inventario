import axios from "axios";
import { store } from "../store";
import { refreshTokenAction } from "../redux/actions/auth/authActions";

// ✅ AGREGAR Content-Type en la creación
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_CSRF_API_URL,
  headers: {
    'Content-Type': 'application/json', // 👈 ESTO ES CRÍTICO
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.loginReducer?.token;
    
    if (token) {      
      config.headers.Authorization = `Bearer ${token}`;
      console.log("📤 Enviando petición con token:", token.substring(0, 20) + "...");
      
      // Decodificar token para ver expiración (debug)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("⏰ Token expira:", new Date(payload.exp * 1000).toLocaleTimeString());
      } catch (e) {
        console.log("⚠️ No se pudo decodificar el token");
      }
    }
    
    // ✅ Asegurar headers necesarios
    config.headers.Accept = "application/json";
    // El Content-Type ya viene de la configuración base
    
    console.log("📋 Headers enviados:", {
      'Content-Type': config.headers['Content-Type'],
      'Authorization': config.headers.Authorization ? 'Bearer xxx...' : 'no token',
      'Accept': config.headers.Accept
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas (igual que tenías)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Respuesta exitosa:", response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 🔍 DIAGNÓSTICO DEL ERROR
    console.log("🔴 Error interceptado:", {
      tipo: error.code || "desconocido",
      mensaje: error.message,
      status: error.response?.status,
      url: originalRequest?.url,
      hora: new Date().toLocaleTimeString(),
      esErrorRed: !error.response,
      esCORS: error.message.includes('CORS')
    });

    // 🚨 Caso 1: Error de RED
    if (!error.response) {
      console.log("❌ Error de red - No se puede conectar al servidor");
      if (error.message.includes('CORS')) {
        console.log("🚫 Error CORS - Revisar configuración del backend");
      }
      return Promise.reject(error);
    }

    // 🚨 Caso 2: Error 401 (token expirado)
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("🔄 Token 401 detectado - Iniciando refresh...");
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await store.dispatch(refreshTokenAction() as any);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 🚨 Caso 3: Otros errores
    console.log(`❌ Error ${error.response.status} - No se intenta refresh`);
    return Promise.reject(error);
  }
);

export default axiosInstance;