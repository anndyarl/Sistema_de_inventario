import { Dispatch } from "redux";
import {
    POST_FORMULARIO_TRASLADO_REQUEST,
    POST_FORMULARIO_TRASLADO_SUCCESS,
    POST_FORMULARIO_TRASLADO_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

export const registroTrasladoActions = (FormularioTraslado: Record<string, any>) => async (dispatch: Dispatch): Promise<boolean> => {

    if (!FormularioTraslado || Object.keys(FormularioTraslado).length === 0) {
        return false;
    }
    const body = JSON.stringify(FormularioTraslado);

    dispatch({ type: POST_FORMULARIO_TRASLADO_REQUEST });


    const response = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearTraslados`, body);

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
                payload: response.data
            });
            return false;
        }
    }
    else {
        dispatch({
            type: POST_FORMULARIO_TRASLADO_FAIL,
            error: "No se pudo registrar el traslado. Por favor, intente nuevamente.",
        });
        return false;
    }
}


