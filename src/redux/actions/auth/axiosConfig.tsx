// src/api/axiosConfig.ts
import axios from "axios";
import { store } from "../../../store";
import { LOGOUT } from "../auth/types";

// Crear instancia
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_CSRF_API_URL,
    headers: {
        Accept: "application/json",
    },
});

// Interceptor para respuestas (maneja errores 401)
axiosInstance.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;

    // Si es error 401 y no hemos reintentado aún
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            store.dispatch({ type: LOGOUT });
            return Promise.reject(error);
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/api/data/Refresh2`, { refreshToken });
            const { accessToken } = res.data;

            localStorage.setItem("token", accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return axiosInstance(originalRequest); // Reintenta con nuevo token
        } catch (refreshError) {
            store.dispatch({ type: LOGOUT });
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
}
);

export default axiosInstance;
