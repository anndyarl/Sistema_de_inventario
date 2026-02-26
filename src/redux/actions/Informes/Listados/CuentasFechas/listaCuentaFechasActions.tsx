import {
  LISTA_CUENTA_FECHAS_REQUEST,
  LISTA_CUENTA_FECHAS_SUCCESS,
  LISTA_CUENTA_FECHAS_FAIL,
} from '../../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../../services/axiosConfig';

export const listaCuentaFechasActions = (fDesde: string, fHasta: string, codCuenta: string) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_CUENTA_FECHAS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/ReporteCuentaFechas?fDesde=${fDesde}&fHasta=${fHasta}&codCuenta=${codCuenta}`);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_CUENTA_FECHAS_SUCCESS,
          payload: res.data
        });
        return true;
      }
      else {
        dispatch({ type: LISTA_CUENTA_FECHAS_FAIL });
        return false;
      }

    } else {
      dispatch({ type: LISTA_CUENTA_FECHAS_FAIL });
    }
    return false;
  } catch (err: any) {
    dispatch({
      type: LISTA_CUENTA_FECHAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
