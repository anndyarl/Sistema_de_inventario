import axios from 'axios';
import {
    LOGIN_PRUEBA_REQUEST,
    LOGIN_PRUEBA_SUCCESS,
    LOGIN_PRUEBA_FAIL,
    LOGOUT,
} from './types';
import { Dispatch } from 'redux';


// Acción para obtener usuario de prueba(tabla INV_T_USUARIOROLAPP)
export const loginPruebaActions = () => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; //token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: LOGIN_PRUEBA_REQUEST });

        try {
            const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeUsuariosPrueba`, config);

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
            // console.error("Error en la solicitud:", err);
            dispatch({
                type: LOGIN_PRUEBA_FAIL,
                error: "Error en la solicitud:", err,
            });
            dispatch({ type: LOGOUT });
            return false;
        }
    } else {
        dispatch({
            type: LOGIN_PRUEBA_FAIL,
            error: "No se encontró un token de autenticación válido.",
        });
        dispatch({ type: LOGOUT });
        return false;

    }
};
