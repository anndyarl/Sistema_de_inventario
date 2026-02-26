import { Dispatch } from "redux";
import {
    POST_FORMULARIO_TRASLADO_REQUEST,
    POST_FORMULARIO_TRASLADO_SUCCESS,
    POST_FORMULARIO_TRASLADO_FAIL,
} from "../../../Traslados/types";
import axiosInstance from "../../../../../services/axiosConfig";


export const registroTrasladoMultipleActions = (FormularioTraslado: Record<string, any>) => async (dispatch: Dispatch): Promise<boolean> => {

    if (!FormularioTraslado || Object.keys(FormularioTraslado).length === 0) {
        return false;
    }
    const body = JSON.stringify(FormularioTraslado);

    dispatch({ type: POST_FORMULARIO_TRASLADO_REQUEST });

    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/ReporteFSD_traslado`, body);

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
                    error: "No se pudo registrar. Por favor, intente nuevamente.",
                });
                return false;
            }
        }
        else {
            dispatch({
                type: POST_FORMULARIO_TRASLADO_FAIL,
                error: "No se pudo obtener registrar. Por favor, intente nuevamente.",
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
};
