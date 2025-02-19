import axios from 'axios';
import {
    COMBO_PROFILE_ESTABLECIMIENTO_REQUEST,
    COMBO_PROFILE_ESTABLECIMIENTO_SUCCESS,
    COMBO_PROFILE_ESTABLECIMIENTO_FAIL,
} from './types';
import { Dispatch } from 'redux';


// Acción para obtener servicio
export const comboEstablecimientosProfileActions = () => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; //token está en el estado de autenticación
    if (token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: COMBO_PROFILE_ESTABLECIMIENTO_REQUEST });

        try {
            const res = await axios.get(`http://localhost:5076/api/inventario/comboTraEstablecimientos`, config);

            if (res.status === 200) {
                dispatch({
                    type: COMBO_PROFILE_ESTABLECIMIENTO_SUCCESS,
                    payload: res.data
                });
                return true;
            } else {
                dispatch({ type: COMBO_PROFILE_ESTABLECIMIENTO_FAIL });
                return false;
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({ type: COMBO_PROFILE_ESTABLECIMIENTO_FAIL });
            return false;
        }
    } else {
        dispatch({ type: COMBO_PROFILE_ESTABLECIMIENTO_FAIL });
        return false;
    }
};
