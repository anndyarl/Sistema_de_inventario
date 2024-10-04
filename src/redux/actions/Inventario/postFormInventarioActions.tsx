import { Dispatch } from "redux";
import axios from 'axios';
import {
    POST_FORMULARIO_REQUEST,
    POST_FORMULARIO_SUCCESS,
    POST_FORMULARIO_FAIL,
} from '../types';




// Acción para enviar el formulario
export const postFormInventarioActions = (formInventario: any) => async (dispatch: Dispatch, getState: any) => {
    const token = getState().auth.token; //token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };
        dispatch({ type: POST_FORMULARIO_REQUEST });
        try {
            const response = await axios.post('/api_inv/api/inventario/crearActivoFijoTest', formInventario, config);

            // Si el POST es exitoso
            if (response.status === 200) {
                dispatch({
                    type: POST_FORMULARIO_SUCCESS,
                    payload: response.data,
                });
                console.log('formInventario datosInventario: enviado correctamente');
            }
        } catch (error: any) {
            // Manejo detallado del error
            const errorMessage = error.response?.data?.message || error.message || 'Error al enviar el formulario';
            dispatch({
                type: POST_FORMULARIO_FAIL,
                payload: errorMessage, // Mandamos el mensaje de error al reducer
            });
            console.error('Error al enviar el formulario:', errorMessage);
        }
    } else {
        console.error('No token available'); // Mensaje en caso de que no haya token
    }
};
