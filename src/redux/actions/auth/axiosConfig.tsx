// src/api/axiosConfig.ts
import axios from "axios";
import { store } from "../../../store";
import { LOGOUT } from "../auth/types";

// Crear instancia
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_CSRF_API_URL,
    timeout: 20000,
    headers: {
        Accept: "application/json",
    },
});


axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.loginReducer?.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ----------------------------------
//   INTERCEPTOR DE RESPUESTA
// ----------------------------------
axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {

        // Si el backend devuelve 401 → token expirado
        if (error.response?.status === 401) {
            console.warn("⚠ TOKEN EXPIRADO O INVÁLIDO");

            store.dispatch({ type: LOGOUT });

            // Redirige al login
            window.location.href = "/login";

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
