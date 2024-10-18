import { Dispatch } from "redux";
import axios from 'axios';
import {
    POST_FORMULARIO_REQUEST,
    POST_FORMULARIO_SUCCESS,
    POST_FORMULARIO_FAIL,
} from '../types';



// Acción para enviar el formulario
export const postFormInventarioActions = (FormulariosCombinados: Record<string, any>) =>
    async (dispatch: Dispatch, getState: any): Promise<boolean> => { 
        const token = getState().auth.token; // Token está en el estado de autenticación
        if (token) {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/jsona'
                },
            };
            // Verifica si `datosInventario` tiene datos antes de enviar
            if (!FormulariosCombinados || Object.keys(FormulariosCombinados).length === 0) {
                console.error("El objeto datosInventario está vacío.");
                return false;
            }
            const body = JSON.stringify({
                FormulariosCombinados,
            });

            dispatch({ type: POST_FORMULARIO_REQUEST });

            try {
                const response = await axios.post('/api_inv/api/inventario/crearActivoFijoTest', body, config);

                // Si el POST es exitoso
                if (response.status === 200) {
                    dispatch({
                        type: POST_FORMULARIO_SUCCESS,
                        payload: response.data,
                    });
                    console.log('Post enviado correctamente desde axios');
                    return true;  // Retorna true en caso de éxito
                }
            } catch (error: any) {
                // Manejo detallado del error
                const errorMessage = error.response?.data?.message || error.message || 'Error al enviar el formulario';
                dispatch({
                    type: POST_FORMULARIO_FAIL,
                    payload: errorMessage, // Mandamos el mensaje de error al reducer
                });
                console.error('Error al enviar el formulario:', errorMessage);
                return false;  // Retorna false en caso de error
            }
        } else {
            console.error('No token available'); // Mensaje en caso de que no haya token
            return false;  // Retorna false si no hay token
        }

        // Añadir un return al final de la función para cumplir con el tipo de retorno
        return false; // Retorno por defecto (esto nunca debería ser alcanzado)
    };

