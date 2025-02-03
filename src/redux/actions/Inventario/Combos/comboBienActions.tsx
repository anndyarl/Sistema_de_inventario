import axios from 'axios';
import {
    BIEN_REQUEST,
    BIEN_SUCCESS,
    BIEN_FAIL,
} from '../types';
import { Dispatch } from 'redux';


// Acción para obtener servicio
export const comboBien = () => async (dispatch: Dispatch, getState: any) => {
    const token = getState().loginReducer.token; //token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: BIEN_REQUEST });

        try {
            const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeBien`, config);

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
