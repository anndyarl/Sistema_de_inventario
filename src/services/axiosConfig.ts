import axios from "axios";
import { store } from "../store";
import { refreshTokenAction } from "../redux/actions/auth/authActions";


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_CSRF_API_URL,
  headers: {
    'Content-Type': 'application/json', // AGREGAR ESTO POR DEFECTO
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
    
   // En tu interceptor o donde decodifiques el token
try {
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Fecha de expiración (viene en segundos, multiplicar por 1000 para milisegundos)
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    
    // Calcular días restantes
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    console.log("==========================================");
    console.log("🔐 INFORMACIÓN DEL TOKEN:");
  console.log(`📅 Fecha actual: ${now.toLocaleString()}`);
    console.log(`📅 Fecha de expiración (exp): ${expDate.toLocaleString()}`);  
    console.log("------------------------------------------");
    
    // Mostrar según el tiempo restante
    if (diffTime < 0) {
      console.log("❌ TOKEN EXPIRADO");
    // store.dispatch({ type: "LOGOUT" });
    } else if (diffDays > 0) {
      console.log(`✅ Token válido por: ${diffDays} día(s)`);
      console.log(`   Expira el: ${expDate.toLocaleDateString()}`);
    } else if (diffHours > 0) {
      console.log(`✅ Token válido por: ${diffHours} hora(s) y ${diffMinutes} minuto(s)`);
    } else {
      console.log(`✅ Token válido por: ${diffMinutes} minuto(s)`);
    }
    console.log("==========================================");
  }
} catch (e) {
  console.log("No se pudo decodificar el token");
}    
    config.headers.Accept = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Respuesta exitosa:", response.status);
        return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // DIAGNÓSTICO DEL ERROR
    console.log("Error interceptado:", {
      tipo: error.code || "desconocido",
      mensaje: error.message,
      status: error.response?.status,
      url: originalRequest?.url,
      hora: new Date().toLocaleTimeString(),
      esErrorRed: !error.response, // true si es error de red
      esCORS: error.message.includes('CORS')
    });

    // Caso 1: Error de RED (servidor caído, CORS, timeout)
    if (!error.response) {
      console.log("Error de red - No se puede conectar al servidor");
      
      // Si es error de CORS, mensaje específico
      if (error.message.includes('CORS')) {
        console.log("Error CORS - Revisar configuración del backend");
      }
      
      // NO intentar refresh, rechazar directamente
      return Promise.reject(error);
    }

    // Caso 2: Error 401 (token expirado) - Solo estos intentan refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("Token 401 detectado - Iniciando refresh...");
      
      // Aquí va toda tu lógica de refresh
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

    // Caso 3: Otros errores (400, 403, 404, 500, etc.)
    console.log(`Error ${error.response.status} - No se intenta refresh`);
    return Promise.reject(error);
  }
);
export default axiosInstance;