import { Dispatch } from "redux";
import axios from "axios";
import {
    POST_FORMULARIO_TRASLADO_REQUEST,
    POST_FORMULARIO_TRASLADO_SUCCESS,
    POST_FORMULARIO_TRASLADO_FAIL,
} from "./types";

// Acción para enviar el formulario
export const registroTrasladoActions = (FormularioTraslado: Record<string, any>) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; // Token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
        // Verifica si `datosInventario` tiene datos antes de enviar
        if (!FormularioTraslado || Object.keys(FormularioTraslado).length === 0) {
            // console.error("El objeto datosInventario está vacío.");
            return false;
        }
        const body = JSON.stringify(FormularioTraslado);

        dispatch({ type: POST_FORMULARIO_TRASLADO_REQUEST });

        try {
            const response = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearTraslados`, body, config);

            // Si el POST es exitoso
            if (response.status === 200) {
                if (response.data.lenght > 0) {
                    dispatch({
                        type: POST_FORMULARIO_TRASLADO_SUCCESS,
                        payload: response.data
                    });
                    return true;
                }
            }
        } catch (error: any) {
            // Manejo detallado del error
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Error al enviar el formulario";
            dispatch({
                type: POST_FORMULARIO_TRASLADO_FAIL,
                payload: errorMessage,
            });

            return false; // Retorna false en caso de error
        }
    } else {
        // console.error("No token available"); // Mensaje en caso de que no haya token
        return false; // Retorna false si no hay token
    }

    // Añadir un return al final de la función para cumplir con el tipo de retorno
    return false; // Retorno por defecto (esto nunca debería ser alcanzado)
};
