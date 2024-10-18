import { Dispatch } from "redux";
import axios from 'axios';
import {
    INVENTARIO_REQUEST,
    INVENTARIO_SUCCESS,
    INVENTARIO_FAIL,
} from '../types';

// Acción para obtener la recepción por número
export const obtenerInventarioActions = (nInventario: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().auth.token; //token está en el estado de autenticación

    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        };

        dispatch({ type: INVENTARIO_REQUEST });

        try {
            // Llamada GET a la API con el número de recepción como parámetro
            const res = await axios.get(`/api_inv/api/inventario/TraeInvxID?AF_CLAVE=${nInventario}`, config);
            console.log('Respuesta del servidor obtener nInventario:', res);

            if (res.status === 200) {
                if (res.data?.length) {
                    dispatch({
                        type: INVENTARIO_SUCCESS,
                        payload: res.data,
                    });
                    return true;
                }
                else {
                    return false
                }

            } else {
                dispatch({
                    type: INVENTARIO_FAIL,
                    error: 'No se pudo obtener el inventario. Por favor, intente nuevamente.',
                });
                return false;
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({
                type: INVENTARIO_FAIL,
                error: 'Error en la solicitud. Por favor, intente nuevamente.',
            });
            return false;
        }
    } else {
        dispatch({
            type: INVENTARIO_FAIL,
            error: 'No se encontró un token de autenticación válido.',
        });
        return false;
    }
};
