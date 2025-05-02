import { Dispatch } from "redux";
import axios from "axios";
import {
    POST_FORMULARIO_TRASLADO_REQUEST,
    POST_FORMULARIO_TRASLADO_SUCCESS,
    POST_FORMULARIO_TRASLADO_FAIL,
} from "./types";
import { LOGOUT } from "../auth/types";

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
                if (response.data === 1) {
                    dispatch({
                        type: POST_FORMULARIO_TRASLADO_SUCCESS,
                        payload: response.data
                    });
                    console.log("response.data", response.data);
                    return true;
                }
                else {
                    dispatch({
                        type: POST_FORMULARIO_TRASLADO_FAIL,
                        payload: response.data
                    });
                    console.log("response.data fail", response.data);
                    return false;
                }
            }
            else {
                dispatch({
                    type: POST_FORMULARIO_TRASLADO_FAIL,
                    error: "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
                });
                return false;
            }
        } catch (err: any) {
            dispatch({
                type: POST_FORMULARIO_TRASLADO_FAIL,
                error: "El token ha expirado.",
            });
            // dispatch({ type: LOGOUT });
            return false;
        }
    } else {
        dispatch({
            type: POST_FORMULARIO_TRASLADO_FAIL,
            error: "No se encontró un token de autenticación válido.",
        });
        dispatch({ type: LOGOUT });
        return false;
    }
};
