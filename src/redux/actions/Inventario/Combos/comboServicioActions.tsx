import {
  SERVICIO_REQUEST,
  SERVICIO_SUCCESS,
  SERVICIO_FAIL,
} from '../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../services/axiosConfig';

export const comboServicioActions = (establ_corr: number) => async (dispatch: Dispatch) => {

  dispatch({ type: SERVICIO_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeServicio?establ_corr=${establ_corr}`);

    if (res.status === 200) {
      dispatch({
        type: SERVICIO_SUCCESS,
        payload: res.data
      });
    } else {
      dispatch({ type: SERVICIO_FAIL });
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({ type: SERVICIO_FAIL });
  }
};
