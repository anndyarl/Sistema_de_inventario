import axios from 'axios';
import {
    OBTENER_MAX_INVENTARIO_REQUEST,
    OBTENER_MAX_INVENTARIO_SUCCESS,
    OBTENER_MAX_INVENTARIO_FAIL,
} from '../types';
import { Dispatch } from 'redux';
import { LOGOUT } from '../../auth/types';


// Acción para obtener INVENTARIO
export const obtenerMaxInventarioActions = () => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; //token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: OBTENER_MAX_INVENTARIO_REQUEST });

        try {
            const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeMaxCorrInventario`, config);

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
                error: "El token ha expirado.",
            });
            // dispatch({ type: LOGOUT });
            return false;
        }
    } else {
        dispatch({
            type: OBTENER_MAX_INVENTARIO_FAIL,
            error: "No se encontró un token de autenticación válido.",
        });
        dispatch({ type: LOGOUT });
        return false;
    }
};
