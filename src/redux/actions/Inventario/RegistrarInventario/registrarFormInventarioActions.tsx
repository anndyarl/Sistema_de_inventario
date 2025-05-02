import { Dispatch } from "redux";
import axios from "axios";
import {
    POST_FORMULARIO_REQUEST,
    POST_FORMULARIO_SUCCESS,
    POST_FORMULARIO_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para enviar el formulario
export const registrarFormInventarioActions = (FormulariosCombinados: Record<string, any>) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; // Token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
        // Verifica si `datosInventario` tiene datos antes de enviar
        if (!FormulariosCombinados || Object.keys(FormulariosCombinados).length === 0) {
            // console.error("El objeto datosInventario está vacío.");
            return false;
        }
        const body = JSON.stringify({ FormulariosCombinados });

        dispatch({ type: POST_FORMULARIO_REQUEST });

        try {
            const response = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/crearActivoFijo`, body, config);

            // Si el POST es exitoso
            if (response.status === 200) {
                if (response.data?.formulariosCombinados != null) {
                    dispatch({
                        type: POST_FORMULARIO_SUCCESS,
                        payload: response.data.formulariosCombinados
                    });
                    return true;
                }
                else {
                    return false;
                }
            } else {
                dispatch({
                    type: POST_FORMULARIO_FAIL,
                    error: "No se pudo enviar los datos. Por favor, intente nuevamente.",
                });
                return false;
            }
        } catch (err: any) {
            console.error("Error en la solicitud:", err);
            dispatch({
                type: POST_FORMULARIO_FAIL,
                error: "El token ha expirado.",
            });
            // dispatch({ type: LOGOUT });
            return false;
        }
    } else {
        dispatch({
            type: POST_FORMULARIO_FAIL,
            error: "No se encontró un token de autenticación válido.",
        });
        dispatch({ type: LOGOUT });
        return false;
    }
};