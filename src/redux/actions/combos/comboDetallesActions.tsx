import axios from 'axios';
import {
    BIEN_DETALLES_REQUEST,
    BIEN_DETALLES_SUCCESS,
    BIEN_DETALLES_FAIL,
} from '../types';
import { Dispatch } from 'redux';



// Acción para obtener servicio
export const comboDetalles = (idPadre: string) => async (dispatch: Dispatch, getState: any) => {
    const token = getState().auth.token; //token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: BIEN_DETALLES_REQUEST });

        try {
            const res = await axios.get(`/api_inv/api/inventario/comboTraeBienxPadre?idPadre=${idPadre}`, config);

            if (res.status === 200) {
                dispatch({
                    type: BIEN_DETALLES_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({ type: BIEN_DETALLES_FAIL });
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({ type: BIEN_DETALLES_FAIL });
        }
    } else {
        dispatch({ type: BIEN_DETALLES_FAIL });
    }
};
