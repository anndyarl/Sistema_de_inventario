import { Dispatch } from "redux";
import axios from "axios";
import {
    POST_FORMULARIO_BIENES_REQUEST,
    POST_FORMULARIO_BIENES_SUCCESS,
    POST_FORMULARIO_BIENES_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para enviar el formulario
export const registrarBienFuncionarioActions = (RUT_FUNCIONARIO: string, DEP_CORR: number, SER_CORR: number, IMAGEN_COMPROBANTE_PAGO: File, IMAGEN_AUTORIZACION: File
) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token;

    if (token) {
        // Configuración para enviar multipart/form-data
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };
        const COMPROBANTE_PAGO = String(IMAGEN_COMPROBANTE_PAGO.name);
        const AUTORIZACION = String(IMAGEN_AUTORIZACION.name);

        const formBienesFormulario = new FormData();
        formBienesFormulario.append("RUT_FUNCIONARIO", RUT_FUNCIONARIO);
        formBienesFormulario.append("DEP_CORR", DEP_CORR.toString());
        formBienesFormulario.append("SER_CORR", SER_CORR.toString());
        formBienesFormulario.append("COMPROBANTE_PAGO", COMPROBANTE_PAGO);
        formBienesFormulario.append("AUTORIZACION", AUTORIZACION);
        formBienesFormulario.append("IMAGEN_COMPROBANTE_PAGO", IMAGEN_COMPROBANTE_PAGO); // Archivo en binario
        formBienesFormulario.append("IMAGEN_AUTORIZACION", IMAGEN_AUTORIZACION);         // Archivo en binario

        dispatch({ type: POST_FORMULARIO_BIENES_REQUEST });

        try {
            const response = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/crearBienFuncionario`, formBienesFormulario, config);
            if (response.status === 200) {
                dispatch({
                    type: POST_FORMULARIO_BIENES_SUCCESS,
                    payload: response.data,
                });
                return true;
            } else {
                dispatch({
                    type: POST_FORMULARIO_BIENES_FAIL,
                    error: "No se pudo enviar los datos. Por favor, intente nuevamente.",
                });
                return false;
            }
        } catch (err: any) {
            console.error("Error en la solicitud:", err);
            dispatch({
                type: POST_FORMULARIO_BIENES_FAIL,
                error: "El token ha expirado.",
            });
            // dispatch({ type: LOGOUT });
            return false;
        }
    } else {
        dispatch({
            type: POST_FORMULARIO_BIENES_FAIL,
            error: "No se encontró un token de autenticación válido.",
        });
        dispatch({ type: LOGOUT });
        return false;
    }
};