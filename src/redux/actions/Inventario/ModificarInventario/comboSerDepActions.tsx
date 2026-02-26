import {
  COMBO_SER_DEP_MODIFICAR_REQUEST,
  COMBO_SER_DEP_MODIFICAR_SUCCESS,
  COMBO_SER_DEP_MODIFICAR_FAIL,
} from '../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../services/axiosConfig';

export const comboSerDepActions = (establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: COMBO_SER_DEP_MODIFICAR_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeServicioDependenciaInv?establ_corr=${establ_corr}`);

    if (res.status === 200) {
      dispatch({
        type: COMBO_SER_DEP_MODIFICAR_SUCCESS,
        payload: res.data
      });
      return true;
    } else {
      dispatch({ type: COMBO_SER_DEP_MODIFICAR_FAIL });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: COMBO_SER_DEP_MODIFICAR_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
