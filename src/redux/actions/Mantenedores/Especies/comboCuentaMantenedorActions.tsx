import {
    COMBO_CUENTAS_MANTENEDOR_REQUEST,
    COMBO_CUENTAS_MANTENEDOR_SUCCESS,
    COMBO_CUENTAS_MANTENEDOR_FAIL,
} from '../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../services/axiosConfig';


export const comboCuentaMantenedorActions = () => async (dispatch: Dispatch): Promise<boolean> => {

    dispatch({ type: COMBO_CUENTAS_MANTENEDOR_REQUEST });

    try {
        const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeAllCuenta`);

        if (res.status === 200) {
            dispatch({
                type: COMBO_CUENTAS_MANTENEDOR_SUCCESS,
                payload: res.data
            });
            return true;
        } else {
            dispatch({ type: COMBO_CUENTAS_MANTENEDOR_FAIL });
            return false;
        }
    } catch (err: any) {
        dispatch({
            type: COMBO_CUENTAS_MANTENEDOR_FAIL,
            error: "Error en la solicitud:", err,
        });
        return false;
    }
};

