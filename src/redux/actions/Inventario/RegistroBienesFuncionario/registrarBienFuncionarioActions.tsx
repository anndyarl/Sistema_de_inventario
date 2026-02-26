import { Dispatch } from "redux";
import axios from "axios";
import {
    POST_FORMULARIO_BIENES_REQUEST,
    POST_FORMULARIO_BIENES_SUCCESS,
    POST_FORMULARIO_BIENES_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

// Función auxiliar para convertir archivo a base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
};

// Acción para enviar el formulario
export const registrarBienFuncionarioActions = (RUT_FUNCIONARIO: string, SER_CORR: number, DEP_CORR: number, IMAGEN_COMPROBANTE_PAGO: File, IMAGEN_AUTORIZACION: File, AF_CODIGO_GENERICO: string) => async (dispatch: Dispatch): Promise<boolean> => {

    const COMPROBANTE_PAGO = IMAGEN_COMPROBANTE_PAGO ? String(IMAGEN_COMPROBANTE_PAGO.name) : "";
    const AUTORIZACION = IMAGEN_AUTORIZACION ? String(IMAGEN_AUTORIZACION.name) : "";

    try {
        // Convertir archivos a base64 solo si existen
        const comprobanteBase64 = IMAGEN_COMPROBANTE_PAGO ? await fileToBase64(IMAGEN_COMPROBANTE_PAGO) : "";
        const autorizacionBase64 = IMAGEN_AUTORIZACION ? await fileToBase64(IMAGEN_AUTORIZACION) : "";

        const formBienesFormulario = new FormData();
        formBienesFormulario.append("RUT_FUNCIONARIO", RUT_FUNCIONARIO);
        formBienesFormulario.append("SER_CORR", SER_CORR.toString());
        formBienesFormulario.append("DEP_CORR", DEP_CORR.toString());
        formBienesFormulario.append("COMPROBANTE_PAGO", COMPROBANTE_PAGO);
        formBienesFormulario.append("AUTORIZACION", AUTORIZACION);
        formBienesFormulario.append("AF_CODIGO_GENERICO", AF_CODIGO_GENERICO);
        formBienesFormulario.append("IMAGEN_COMPROBANTE_PAGO", comprobanteBase64);     // Archivo en base64 o vacío
        formBienesFormulario.append("IMAGEN_AUTORIZACION", autorizacionBase64);         // Archivo en base64 o vacío

        dispatch({ type: POST_FORMULARIO_BIENES_REQUEST });

        const response = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/crearBienFuncionario`, formBienesFormulario);
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

        return false;
    }
};
