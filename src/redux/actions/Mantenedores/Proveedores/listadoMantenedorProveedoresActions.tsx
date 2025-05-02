import axios from 'axios';
import {
    LISTA_MANTENEDOR_PROVEEDORES_REQUEST,
    LISTA_MANTENEDOR_PROVEEDORES_SUCCESS,
    LISTA_MANTENEDOR_PROVEEDORES_FAIL,
} from '../types';
import { Dispatch } from 'redux';
import { LOGOUT } from '../../auth/types';


// Acción para obtener servicio
export const listadoMantenedorProveedoresActions = () => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; //token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: LISTA_MANTENEDOR_PROVEEDORES_REQUEST });

        try {
            const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeMantenedorProveedores`, config);

            if (res.status === 200) {
                dispatch({
                    type: LISTA_MANTENEDOR_PROVEEDORES_SUCCESS,
                    payload: res.data
                });
                return true;
            } else {
                dispatch({ type: LISTA_MANTENEDOR_PROVEEDORES_FAIL });
                return false;
            }
        } catch (err: any) {
            dispatch({
                type: LISTA_MANTENEDOR_PROVEEDORES_FAIL,
                error: "El token ha expirado.",
            });
            // dispatch({ type: LOGOUT });
            return false;
        }
    } else {
        dispatch({
            type: LISTA_MANTENEDOR_PROVEEDORES_FAIL,
            error: "No se encontró un token de autenticación válido.",
        });
        dispatch({ type: LOGOUT });
        return false;
    }
};