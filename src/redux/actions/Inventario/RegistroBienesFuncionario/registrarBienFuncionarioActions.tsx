import { Dispatch } from "redux";
import axios from "axios";
import {
    POST_FORMULARIO_BIENES_REQUEST,
    POST_FORMULARIO_BIENES_SUCCESS,
    POST_FORMULARIO_BIENES_FAIL,
} from "../types";

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
            const response = await axios.post("/api_inv/api/inventario/crearBienFuncionario", formBienesFormulario, config);

            if (response.status === 200) {
                dispatch({
                    type: POST_FORMULARIO_BIENES_SUCCESS,
                    payload: response.data,
                });
                console.log("Post enviado correctamente desde axios");
                return true;
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || error.message || "Error al enviar el formulario";
            dispatch({
                type: POST_FORMULARIO_BIENES_FAIL,
                payload: errorMessage,
            });
            console.error("Error al enviar el formulario:", errorMessage);
            return false;
        }
    } else {
        console.error("No token available");
        return false;
    }

    return false;
};

// export const registrarBienFuncionarioActions = (RUT_FUNCIONARIO: string, DEP_CORR: number, SER_CORR: number, IMAGEN_COMPROBANTE_PAGO: File, IMAGEN_AUTORIZACION: File
// ) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
//     const token = getState().loginReducer.token;

//     if (token) {
//         // Configuración para enviar multipart/form-data
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "multipart/form-data",
//             },
//         };
//         const COMPROBANTE_PAGO = String(IMAGEN_COMPROBANTE_PAGO.name);
//         const AUTORIZACION = String(IMAGEN_AUTORIZACION.name);

//         // Define la URL con los parámetros query
//         const url = `/api_inv/api/inventario/crearBienFuncionario?RUT_FUNCIONARIO=${RUT_FUNCIONARIO}&DEP_CORR=${DEP_CORR}&SER_CORR=${SER_CORR}&COMPROBANTE_PAGO=${COMPROBANTE_PAGO}&AUTORIZACION=${AUTORIZACION}`;

//         const formBienesFormulario = new FormData();

//         formBienesFormulario.append("IMAGEN_COMPROBANTE_PAGO", IMAGEN_COMPROBANTE_PAGO); // Archivo en binario
//         formBienesFormulario.append("IMAGEN_AUTORIZACION", IMAGEN_AUTORIZACION);         // Archivo en binario

//         dispatch({ type: POST_FORMULARIO_BIENES_REQUEST });

//         try {
//             const response = await axios.post(url, formBienesFormulario, config);

//             if (response.status === 200) {
//                 dispatch({
//                     type: POST_FORMULARIO_BIENES_SUCCESS,
//                     payload: response.data,
//                 });
//                 console.log("Post enviado correctamente desde axios");
//                 return true;
//             }
//         } catch (error: any) {
//             const errorMessage =
//                 error.response?.data?.message || error.message || "Error al enviar el formulario";
//             dispatch({
//                 type: POST_FORMULARIO_BIENES_FAIL,
//                 payload: errorMessage,
//             });
//             console.error("Error al enviar el formulario:", errorMessage);
//             return false;
//         }
//     } else {
//         console.error("No token available");
//         return false;
//     }

//     return false;
// };
