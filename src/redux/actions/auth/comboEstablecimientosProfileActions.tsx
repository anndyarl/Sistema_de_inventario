import {
    COMBO_PROFILE_ESTABLECIMIENTO_REQUEST,
    COMBO_PROFILE_ESTABLECIMIENTO_SUCCESS,
    COMBO_PROFILE_ESTABLECIMIENTO_FAIL,
    LOGOUT,
} from './types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../services/axiosConfig';

export const comboEstablecimientosProfileActions = () => async (dispatch: Dispatch): Promise<boolean> => {


    dispatch({ type: COMBO_PROFILE_ESTABLECIMIENTO_REQUEST });

    try {
        const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraEstablecimientos`);

        if (res.status === 200) {
            if (res.data.length > 0) {
                dispatch({
                    type: COMBO_PROFILE_ESTABLECIMIENTO_SUCCESS,
                    payload: res.data
                });
                return true;
            } else {
                dispatch({ type: COMBO_PROFILE_ESTABLECIMIENTO_FAIL });
                return false;
            }
        } else {
            dispatch({ type: COMBO_PROFILE_ESTABLECIMIENTO_FAIL });
            return false;
        }
    } catch (err) {

        dispatch({
            type: COMBO_PROFILE_ESTABLECIMIENTO_FAIL,
            error: "Error en la solicitud:", err,
        });
        dispatch({ type: LOGOUT });
        return false;
    }
};
