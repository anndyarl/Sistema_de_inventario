import {
    LISTA_MANTENEDOR_ESPECIES_REQUEST,
    LISTA_MANTENEDOR_ESPECIES_SUCCESS,
    LISTA_MANTENEDOR_ESPECIES_FAIL,
} from '../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../services/axiosConfig';

export const listadoMantenedorEspeciesActions = (establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

    dispatch({ type: LISTA_MANTENEDOR_ESPECIES_REQUEST });

    try {
        const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeMantenedorEspecies?establ_corr=${establ_corr}`);

        if (res.status === 200) {
            dispatch({
                type: LISTA_MANTENEDOR_ESPECIES_SUCCESS,
                payload: res.data
            });
            return true;
        } else {
            dispatch({ type: LISTA_MANTENEDOR_ESPECIES_FAIL });
            return false;
        }
    } catch (err: any) {
        dispatch({
            type: LISTA_MANTENEDOR_ESPECIES_FAIL,
            error: "Error en la solicitud:", err,
        });
        return false;
    }
};


