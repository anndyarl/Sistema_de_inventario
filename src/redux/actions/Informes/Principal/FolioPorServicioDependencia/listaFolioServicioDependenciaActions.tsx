import {
  LISTA_SERVICIO_DEPENDENCIA_REQUEST,
  LISTA_SERVICIO_DEPENDENCIA_SUCCESS,
  LISTA_SERVICIO_DEPENDENCIA_FAIL,
} from '../../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../../services/axiosConfig';

export const listaFolioServicioDependenciaActions = (dep_corr: number, af_codigo_generico: string, establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_SERVICIO_DEPENDENCIA_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/ReporteFoliosPorServicioDependencia?dep_corr=${dep_corr}&af_codigo_generico=${af_codigo_generico}&establ_corr=${establ_corr}`);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_SERVICIO_DEPENDENCIA_SUCCESS,
          payload: res.data
        });
        return true;
      }
      else {
        dispatch({ type: LISTA_SERVICIO_DEPENDENCIA_FAIL });
        return false;
      }

    } else {
      dispatch({ type: LISTA_SERVICIO_DEPENDENCIA_FAIL });
    }
    return false;
  } catch (err: any) {
    dispatch({
      type: LISTA_SERVICIO_DEPENDENCIA_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
