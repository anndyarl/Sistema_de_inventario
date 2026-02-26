import { Dispatch } from "redux";
import {
    POST_FORMULARIO_REQUEST,
    POST_FORMULARIO_SUCCESS,
    POST_FORMULARIO_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const registrarFormInventarioActions = (FormulariosCombinados: Record<string, any>) => async (dispatch: Dispatch): Promise<boolean> => {

    if (!FormulariosCombinados || Object.keys(FormulariosCombinados).length === 0) {
        return false;
    }
    const body = JSON.stringify({ FormulariosCombinados });

    dispatch({ type: POST_FORMULARIO_REQUEST });

    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/crearActivoFijo`, body);

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
        return false;
    }
};