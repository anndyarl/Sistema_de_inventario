import axios from 'axios';
import {
    BIEN_REQUEST,
    BIEN_SUCCESS,
    BIEN_FAIL,
} from '../types';
import { Dispatch } from 'redux';


// Acción para obtener servicio
export const comboBien = (token: string) => async (dispatch: Dispatch) => {

    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: BIEN_REQUEST });
        // const EST = 1;
        // const IDBIEN = 37;

        try {
            const res = await axios.get(`/api_inv/api/inventario/comboTraeBien`, config);

            if (res.status === 200) {
                dispatch({
                    type: BIEN_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({ type: BIEN_FAIL });
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({ type: BIEN_FAIL });
        }
    } else {
        dispatch({ type: BIEN_FAIL });
    }
};
