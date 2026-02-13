import { Dispatch } from "redux";
import axios from "axios";
import {
    POST_FORMULARIO_TRASPASO_REQUEST,
    POST_FORMULARIO_TRASPASO_SUCCESS,
    POST_FORMULARIO_TRASPASO_FAIL,
} from "./types";
import { TraspasoConAdjuntos } from "../../../components/Traspasos/RegistrarTraspasos";

// Acción para enviar el formulario
export const registroTraspasoMultipleActions = (FormularioTraspaso: TraspasoConAdjuntos) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; // Token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
        // Verifica si `datosInventario` tiene datos antes de enviar
        if (!FormularioTraspaso || Object.keys(FormularioTraspaso).length === 0) {
            // console.error("El objeto datosInventario está vacío.");
            return false;
        }
        const body = JSON.stringify(FormularioTraspaso);

        dispatch({ type: POST_FORMULARIO_TRASPASO_REQUEST });

        try {
            console.log("Enviando datos de traspaso:", body);
            const response = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearTraspasos`, body, config);

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
    } else {
        dispatch({
            type: POST_FORMULARIO_TRASPASO_FAIL,
            error: "No se encontró un token de autenticación válido.",
        });
        return false;
    }
};



