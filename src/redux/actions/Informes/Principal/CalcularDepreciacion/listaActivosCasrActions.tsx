import {
  LISTA_ACTIVOS_FIJOS_INFORME_REQUEST,
  LISTA_ACTIVOS_FIJOS_INFORME_SUCCESS,
  LISTA_ACTIVOS_FIJOS_INFORME_FAIL,
} from '../../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../../services/axiosConfig';

export const listaActivosCasrActions = (cta_cod: string, fDesde: string, fHasta: string, af_codigo_generico: string, establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_ACTIVOS_FIJOS_INFORME_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeInventarioCASR?cta_cod=${cta_cod}&fDesde=${fDesde}&fHasta=${fHasta}&af_codigo_generico=${af_codigo_generico}&establ_corr=${establ_corr}`);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_ACTIVOS_FIJOS_INFORME_SUCCESS,
          payload: res.data
        });
        return true;
      }
      else {
        dispatch({ type: LISTA_ACTIVOS_FIJOS_INFORME_FAIL });
        return false;
      }
    } else {
      dispatch({ type: LISTA_ACTIVOS_FIJOS_INFORME_FAIL });
    }
    return false;
  } catch (err: any) {
    dispatch({
      type: LISTA_ACTIVOS_FIJOS_INFORME_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
