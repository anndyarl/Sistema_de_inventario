import {
    OBTENER_MAX_INVENTARIO_REQUEST,
    OBTENER_MAX_INVENTARIO_SUCCESS,
    OBTENER_MAX_INVENTARIO_FAIL,
} from '../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../services/axiosConfig';

export const obtenerMaxInventarioActions = () => async (dispatch: Dispatch): Promise<boolean> => {

    dispatch({ type: OBTENER_MAX_INVENTARIO_REQUEST });

    try {
        const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeMaxCorrInventario`);

        const AF_CODIGO_GENERICO = res.data.aF_CODIGO_GENERICO;

        if (res.status === 200) {
            dispatch({
                type: OBTENER_MAX_INVENTARIO_SUCCESS,
                payload: AF_CODIGO_GENERICO
            });
            return true;
        } else {
            dispatch({
                type: OBTENER_MAX_INVENTARIO_FAIL,
                error: "No se pudo obtener los datos. Por favor, intente nuevamente.",
            });
            return false;
        }
    } catch (err: any) {
        console.error("Error en la solicitud:", err);
        dispatch({
            type: OBTENER_MAX_INVENTARIO_FAIL,
            error: "Error en la solicitud:", err,
        });
        return false;
    }
};
