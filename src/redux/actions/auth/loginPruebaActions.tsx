import {
    LOGIN_PRUEBA_REQUEST,
    LOGIN_PRUEBA_SUCCESS,
    LOGIN_PRUEBA_FAIL
} from './types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../services/axiosConfig';


// Acción para obtener usuario de prueba(tabla INV_T_USUARIOROLAPP)
export const loginPruebaActions = () => async (dispatch: Dispatch): Promise<boolean> => {

    dispatch({ type: LOGIN_PRUEBA_REQUEST });

    try {
        const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeUsuariosPrueba`);

        if (res.status === 200) {
            if (res.data.length > 0) {
                dispatch({
                    type: LOGIN_PRUEBA_SUCCESS,
                    payload: res.data
                });
                return true;
            } else {
                dispatch({ type: LOGIN_PRUEBA_FAIL });
                return false;
            }
        } else {
            dispatch({ type: LOGIN_PRUEBA_FAIL });
            return false;
        }
    } catch (err) {
        dispatch({
            type: LOGIN_PRUEBA_FAIL,
            error: "Error en la solicitud:", err,
        });
        return false;
    }
};
