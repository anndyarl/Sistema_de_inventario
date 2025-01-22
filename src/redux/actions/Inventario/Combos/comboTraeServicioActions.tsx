import axios from 'axios';
import {
    SERVICIO_REQUEST,
    SERVICIO_SUCCESS,
    SERVICIO_FAIL,
} from '../types';
import { Dispatch } from 'redux';


// Acción para obtener servicio
export const comboTraeServicio = (token: string) => async (dispatch: Dispatch) => {
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: SERVICIO_REQUEST });

        try {
            const res = await axios.get('https://sidra.ssmso.cl/api_erp_inv_qa/api/inventario/comboTraeServicio', config);

            if (res.status === 200) {
                dispatch({
                    type: SERVICIO_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({ type: SERVICIO_FAIL });
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({ type: SERVICIO_FAIL });
        }
    } else {
        dispatch({ type: SERVICIO_FAIL });
    }
};
