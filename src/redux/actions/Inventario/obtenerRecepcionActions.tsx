import { Dispatch } from "redux";
import axios from 'axios';
import {
  RECEPCION_REQUEST,
  RECEPCION_SUCCESS,
  RECEPCION_FAIL,       
} from '../types';

// Acción para obtener la recepción por número
export const obtenerRecepcionActions = (nRecepcion: string) => async (dispatch: Dispatch, getState: any) => {
    const token = getState().auth.token; // Suponiendo que el token está en el estado de autenticación

    if (token) {    
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        };

        dispatch({ type: RECEPCION_REQUEST });

        try {
            // Llamada GET a la API con el número de recepción como parámetro
            const res = await axios.get(`/api_inv/api/inventario/comboTraeRecepcion?numero=${nRecepcion}`, config);
            console.log('Respuesta del servidor obtener nRecepcion:', res); 

            if (res.status === 200) {
                dispatch({
                    type: RECEPCION_SUCCESS,
                    payload: res.data,                   
                }); 
            } else {
                dispatch({
                    type: RECEPCION_FAIL,
                    error: 'No se pudo obtener la recepción. Por favor, intente nuevamente.',
                });
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({
                type: RECEPCION_FAIL,
                error: 'Error en la solicitud. Por favor, intente nuevamente.',
            });
        }
    } else {
        dispatch({
            type: RECEPCION_FAIL,
            error: 'No se encontró un token de autenticación válido.',
        });
    }
};
