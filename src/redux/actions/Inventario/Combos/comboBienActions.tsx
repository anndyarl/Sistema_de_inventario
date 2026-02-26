import {
    BIEN_REQUEST,
    BIEN_SUCCESS,
    BIEN_FAIL,
} from '../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../services/axiosConfig';


export const comboBien = () => async (dispatch: Dispatch) => {

    dispatch({ type: BIEN_REQUEST });

    try {
        const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeBien`);

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

};
