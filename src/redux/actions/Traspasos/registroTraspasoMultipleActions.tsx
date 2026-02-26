import { Dispatch } from "redux";
import {
    POST_FORMULARIO_TRASPASO_REQUEST,
    POST_FORMULARIO_TRASPASO_SUCCESS,
    POST_FORMULARIO_TRASPASO_FAIL,
} from "./types";
import { TraspasoConAdjuntos } from "../../../components/Traspasos/RegistrarTraspasos";
import axiosInstance from "../../../services/axiosConfig";

export const registroTraspasoMultipleActions = (FormularioTraspaso: TraspasoConAdjuntos) => async (dispatch: Dispatch): Promise<boolean> => {

    if (!FormularioTraspaso || Object.keys(FormularioTraspaso).length === 0) {
        return false;
    }
    const body = JSON.stringify(FormularioTraspaso);

    dispatch({ type: POST_FORMULARIO_TRASPASO_REQUEST });

    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearTraspasos`, body);

        if (response.status === 200) {
            dispatch({
                type: POST_FORMULARIO_TRASPASO_SUCCESS,
                payload: response.data
            });
            return true;
        }
        else {
            dispatch({
                type: POST_FORMULARIO_TRASPASO_FAIL,
                error: "No se pudo registrar. Por favor, intente nuevamente.",
            });
            return false;
        }
    } catch (err: any) {
        dispatch({
            type: POST_FORMULARIO_TRASPASO_FAIL,
            error: "Error en la solicitud:", err,
        });
        return false;
    }
};



