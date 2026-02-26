import { Dispatch } from "redux";
import {
    OBTIENE_INV_TRASLADOS_REQUEST,
    OBTIENE_INV_TRASLADOS_SUCCESS,
    OBTIENE_INV_TRASLADOS_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

export const obtenerInventarioTrasladoActions = (aF_CODIGO_GENERICO: string, altaS_CORR: number, esP_CODIGO: string, deP_CORR: number, deT_MARCA: string, deT_MODELO: string, deT_SERIE: string, estabL_CORR: number) => async (dispatch: Dispatch): Promise<boolean> => {

    dispatch({ type: OBTIENE_INV_TRASLADOS_REQUEST });

    try {
        const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeInvTraslado?aF_CODIGO_GENERICO=${aF_CODIGO_GENERICO}&altaS_CORR=${altaS_CORR}&esP_CODIGO=${esP_CODIGO}&deP_CORR=${deP_CORR}&deT_MARCA=${deT_MARCA}&deT_MODELO=${deT_MODELO}&deT_SERIE=${deT_SERIE}&estabL_CORR=${estabL_CORR}`);

        if (res.status === 200) {
            const isEmpty = res.data && Object.values(res.data).every((value) => value === 0 || value === null || value === undefined);
            if (!isEmpty) {
                dispatch({
                    type: OBTIENE_INV_TRASLADOS_SUCCESS,
                    payload: res.data,
                });
                return true;
            } else {
                dispatch({
                    type: OBTIENE_INV_TRASLADOS_FAIL,
                    error:
                        "Status 200, pero con arreglo de datos vacío",
                });
                return false;
            }
        } else {
            dispatch({
                type: OBTIENE_INV_TRASLADOS_SUCCESS,
                error:
                    "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
            });
            return false;
        }
    } catch (err: any) {
        dispatch({
            type: OBTIENE_INV_TRASLADOS_FAIL,
            error: "El token ha expirado.",
        });
        return false;
    }

};
