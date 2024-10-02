import axios from 'axios';
import {
    MODALIDAD_COMPRA_REQUEST,
    MODALIDAD_COMPRA_SUCCESS,
    MODALIDAD_COMPRA_FAIL,
} from '../types';
import { Dispatch } from 'redux';


// Acción para obtener servicio
export const comboModalidadCompra = (token: string) => async (dispatch: Dispatch) => {
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: MODALIDAD_COMPRA_REQUEST });

        try {
            const res = await axios.get('/api_inv/api/inventario/comboTraeModalidad', config);

            if (res.status === 200) {
                dispatch({
                    type: MODALIDAD_COMPRA_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({ type: MODALIDAD_COMPRA_FAIL });
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({ type: MODALIDAD_COMPRA_FAIL });
        }
    } else {
        dispatch({ type: MODALIDAD_COMPRA_FAIL });
    }
};
