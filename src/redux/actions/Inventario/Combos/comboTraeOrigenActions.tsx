import axios from 'axios';
import {
    ORIGEN_REQUEST,
    ORIGEN_SUCCESS,
    ORIGEN_FAIL,       
} from '../types';
import { Dispatch } from 'redux';


// Acción para obtener origen
export const comboTraeOrigen = (token: string) => async (dispatch: Dispatch) => {
    if (token) {    
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: ORIGEN_REQUEST });

        try {
            const res = await axios.get('/api_inv/api/inventario/comboTraeOrigen', config);
            console.log('Respuesta del servidor obtener origen presupuesto:', res); 

            if (res.status === 200) {
                dispatch({
                    type: ORIGEN_SUCCESS,
                    payload: res.data
                }); 
            } else {
                dispatch({ type: ORIGEN_FAIL });
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);          
            dispatch({ type: ORIGEN_FAIL });
        }
    } else {
        dispatch({ type: ORIGEN_FAIL });
    }
};
