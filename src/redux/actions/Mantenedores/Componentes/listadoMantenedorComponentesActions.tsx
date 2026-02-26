import {
    LISTA_MANTENEDOR_COMPONENTES_REQUEST,
    LISTA_MANTENEDOR_COMPONENTES_SUCCESS,
    LISTA_MANTENEDOR_COMPONENTES_FAIL,
} from '../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../services/axiosConfig';

export const listadoMantenedorComponentesActions = () => async (dispatch: Dispatch): Promise<boolean> => {

    dispatch({ type: LISTA_MANTENEDOR_COMPONENTES_REQUEST });

    try {
        const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeMantenedorComponentes`);

        if (res.status === 200) {
            dispatch({
                type: LISTA_MANTENEDOR_COMPONENTES_SUCCESS,
                payload: res.data
            });
            return true;
        } else {
            dispatch({ type: LISTA_MANTENEDOR_COMPONENTES_FAIL });
            return false;
        }
    } catch (err: any) {
        dispatch({
            type: LISTA_MANTENEDOR_COMPONENTES_FAIL,
            error: "Error en la solicitud:", err,
        });
        return false;
    }
};

