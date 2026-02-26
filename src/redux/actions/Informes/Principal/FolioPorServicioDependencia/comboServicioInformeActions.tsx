import {
  COMBO_SERVICIO_INFORME_REQUEST,
  COMBO_SERVICIO_INFORME_SUCCESS,
  COMBO_SERVICIO_INFORME_FAIL,
} from '../../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../../services/axiosConfig';

export const comboServicioInformeActions = (establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: COMBO_SERVICIO_INFORME_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeServicioDependencia?establ_corr=${establ_corr}`);

    if (res.status === 200) {
      dispatch({
        type: COMBO_SERVICIO_INFORME_SUCCESS,
        payload: res.data
      });
      return true;
    } else {
      dispatch({ type: COMBO_SERVICIO_INFORME_FAIL });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: COMBO_SERVICIO_INFORME_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
