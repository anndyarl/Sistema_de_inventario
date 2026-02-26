import {
  COMBO_CUENTA_INFORME_REQUEST,
  COMBO_CUENTA_INFORME_SUCCESS,
  COMBO_CUENTA_INFORME_FAIL,
} from '../../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../../services/axiosConfig';

export const comboCuentasInformeActions = () => async (dispatch: Dispatch) => {

  dispatch({ type: COMBO_CUENTA_INFORME_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeAllCuenta`);

    if (res.status === 200) {
      dispatch({
        type: COMBO_CUENTA_INFORME_SUCCESS,
        payload: res.data
      });
    } else {
      dispatch({ type: COMBO_CUENTA_INFORME_FAIL });
    }
  } catch (err: any) {
    dispatch({
      type: COMBO_CUENTA_INFORME_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
