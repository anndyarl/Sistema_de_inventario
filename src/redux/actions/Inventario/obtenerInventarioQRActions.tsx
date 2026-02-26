import { Dispatch } from "redux";
import {
    OBTIENE_INV_QR_REQUEST,
    OBTIENE_INV_QR_SUCCESS,
    OBTIENE_INV_QR_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

export const obtenerInventarioQRActions = (aF_CODIGO_GENERICO: string) => async (dispatch: Dispatch): Promise<boolean> => {

    dispatch({ type: OBTIENE_INV_QR_REQUEST });

    try {
        const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeInvQR?aF_CODIGO_GENERICO=${aF_CODIGO_GENERICO}`);

        if (res.status === 200) {
            const isEmpty = res.data && Object.values(res.data).every((value) => value === 0 || value === null || value === undefined);
            if (!isEmpty) {
                dispatch({
                    type: OBTIENE_INV_QR_SUCCESS,
                    payload: res.data,
                });
                return true;
            } else {
                dispatch({
                    type: OBTIENE_INV_QR_FAIL,
                    error:
                        "Status 200, pero con arreglo de datos vacío",
                });
                return false;
            }
        } else {
            dispatch({
                type: OBTIENE_INV_QR_SUCCESS,
                error:
                    "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
            });
            return false;
        }
    } catch (err: any) {
        dispatch({
            type: OBTIENE_INV_QR_FAIL,
            error: "El token ha expirado.",
        });
        return false;
    }
};
