import {
    OBTENER_MAX_SERVICIO_REQUEST,
    OBTENER_MAX_SERVICIO_SUCCESS,
    OBTENER_MAX_SERVICIO_FAIL,
} from '../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../services/axiosConfig';

export const obtenerMaxServicioActions = () => async (dispatch: Dispatch): Promise<boolean> => {

    dispatch({ type: OBTENER_MAX_SERVICIO_REQUEST });

    try {
        const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeMaxCorrServicios`);

        const seR_CORR = res.data.seR_CORR;

        if (res.status === 200) {
            dispatch({
                type: OBTENER_MAX_SERVICIO_SUCCESS,
                payload: seR_CORR
            });
            return true;
        } else {
            dispatch({ type: OBTENER_MAX_SERVICIO_FAIL });
            return false;
        }
    } catch (err: any) {
        dispatch({
            type: OBTENER_MAX_SERVICIO_FAIL,
            error: "Error en la solicitud:", err,
        });
        return false;
    }
};