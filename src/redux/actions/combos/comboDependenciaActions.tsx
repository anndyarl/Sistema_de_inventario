import axios from 'axios';
import {
    DEPENDENCIA_REQUEST,
    DEPENDENCIA_SUCCESS,
    DEPENDENCIA_FAIL,
} from '../types';
import { Dispatch } from 'redux';


// Acción para obtener servicio


export const comboDependencia = (serCorr: string) => async (dispatch: Dispatch, getState: any) => {
    const token = getState().auth.token; //token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: DEPENDENCIA_REQUEST });
        // const serCorr = 0; // O cualquier otro valor dinámico
        try {

            const res = await axios.get(`/api_inv/api/inventario/traeDependencias?ser_corr=${serCorr}`, config);

            console.log("dependencia", res);
            if (res.status === 200) {
                dispatch({
                    type: DEPENDENCIA_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({ type: DEPENDENCIA_FAIL });
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({ type: DEPENDENCIA_FAIL });
        }
    } else {
        dispatch({ type: DEPENDENCIA_FAIL });
    }
};
