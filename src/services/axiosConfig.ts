import axios from "axios";
import { store } from "../store";
import { refreshTokenAction } from "../redux/actions/auth/authActions";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_CSRF_API_URL,
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
    //   console.log("Enviando petición con token:", token.substring(0, 20) + "...");
    }
    config.headers.Accept = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("Respuesta exitosa:", response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // console.log("Error en respuesta:", {
    //   status: error.response?.status,
    //   url: originalRequest.url,
    //   data: error.response?.data,
    //   hora: new Date().toLocaleTimeString()
    // });

    // Si no es 401 o ya se intentó refrescar
    if (error.response?.status !== 401 || originalRequest._retry) {
    //   console.log("Token expirado, intentando refresh...");
      return Promise.reject(error);
    }
    // console.log("Iniciando refresh token - Hora:", new Date().toLocaleTimeString());

    // Si ya está refrescando, encolar
    if (isRefreshing) {
    //   console.log("Refresh en curso, encolando petición");
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
        //   console.log("Petición encolada procesada con nuevo token");
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
    //   console.log("Ejecutando refreshTokenAction...");
      const newToken = await store.dispatch(refreshTokenAction() as any);
      
    //   console.log("Refresh completado - Nuevo token:", newToken.substring(0, 20) + "...");
    //   console.log("Hora refresh:", new Date().toLocaleTimeString());
      
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      processQueue(null, newToken);
      
    //   console.log("Reintentando petición original...");
      return axiosInstance(originalRequest);
      
    } catch (refreshError) {
    //   console.log("Falló el refresh token:", refreshError);
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;