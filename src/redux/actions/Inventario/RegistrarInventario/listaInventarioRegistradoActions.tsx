import axios from 'axios';
import {
    LISTA_INVENTARIO_REGISTRADO_REQUEST,
    LISTA_INVENTARIO_REGISTRADO_SUCCESS,
    LISTA_INVENTARIO_REGISTRADO_FAIL,
} from '../types';
import { Dispatch } from 'redux';


// Acción para obtener INVENTARIO
export const listaInventarioRegistradoActions = () => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; //token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: LISTA_INVENTARIO_REGISTRADO_REQUEST });

        try {
            const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/traeInventarioRegistrado`, config);

            if (res.status === 200) {
                dispatch({
                    type: LISTA_INVENTARIO_REGISTRADO_SUCCESS,
                    payload: res.data,
                });
                return true;
            } else {
                dispatch({ type: LISTA_INVENTARIO_REGISTRADO_FAIL });
                return false;
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({ type: LISTA_INVENTARIO_REGISTRADO_FAIL });
            return false;
        }
    } else {
        dispatch({ type: LISTA_INVENTARIO_REGISTRADO_FAIL });
        return false;
    }
};
