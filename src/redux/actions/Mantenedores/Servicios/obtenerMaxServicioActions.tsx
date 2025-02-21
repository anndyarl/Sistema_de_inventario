import axios from 'axios';
import {
    OBTENER_MAX_SERVICIO_REQUEST,
    OBTENER_MAX_SERVICIO_SUCCESS,
    OBTENER_MAX_SERVICIO_FAIL,
} from '../types';
import { Dispatch } from 'redux';


// Acción para obtener servicio
export const obtenerMaxServicioActions = () => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; //token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: OBTENER_MAX_SERVICIO_REQUEST });

        try {
            const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeMaxCorrServicios`, config);

            const seR_CORR = res.data.seR_CORR;

            if (res.status === 200) {
                dispatch({
                    type: OBTENER_MAX_SERVICIO_SUCCESS,
                    payload: seR_CORR
                });
                return true;
            } else {
                dispatch({ type: OBTENER_MAX_SERVICIO_FAIL });
                return false;
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({ type: OBTENER_MAX_SERVICIO_FAIL });
            return false;
        }
    } else {
        dispatch({ type: OBTENER_MAX_SERVICIO_FAIL });
        return false;
    }
};
