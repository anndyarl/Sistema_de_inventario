import {
  LISTA_VERSIONAMIENTO_REQUEST,
  LISTA_VERSIONAMIENTO_SUCCESS,
  LISTA_VERSIONAMIENTO_FAIL,
} from './types';
import { Dispatch } from 'redux';

import axiosInstance from '../../../services/axiosConfig';

export const listaVersionamientoActions = () => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_VERSIONAMIENTO_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeVersionamiento`);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_VERSIONAMIENTO_SUCCESS,
          payload: res.data
        });
        return true;
      }
      else {
        dispatch({ type: LISTA_VERSIONAMIENTO_FAIL });
        return false;
      }

    } else {
      dispatch({ type: LISTA_VERSIONAMIENTO_FAIL });
    }
    return false;
  } catch (err: any) {
    dispatch({
      type: LISTA_VERSIONAMIENTO_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
