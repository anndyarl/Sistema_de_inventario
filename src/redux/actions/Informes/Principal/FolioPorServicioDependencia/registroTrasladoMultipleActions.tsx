import { Dispatch } from "redux";
import axios from "axios";
import {
    POST_FORMULARIO_TRASLADO_REQUEST,
    POST_FORMULARIO_TRASLADO_SUCCESS,
    POST_FORMULARIO_TRASLADO_FAIL,
} from "../../../Traslados/types";
import { LOGOUT } from "../../../auth/types";

// Acción para enviar el formulario
export const registroTrasladoMultipleActions = (FormularioTraslado: Record<string, any>) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
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
            const response = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/ReporteFSD_traslado`, body, config);

            if (response.status === 200) {
                if (response.data?.length) {
                    dispatch({
                        type: POST_FORMULARIO_TRASLADO_SUCCESS,
                        payload: response.data
                    });
                    return true;
                }
                else {
                    dispatch({
                        type: POST_FORMULARIO_TRASLADO_FAIL,
                        error: "No se pudo obtener el listado. Por favor, intente nuevamente.",
                    });
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
                error: "Error en la solicitud:", err,
            });
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
