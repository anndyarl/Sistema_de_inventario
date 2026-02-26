import { Dispatch } from "redux";

import {
  OBTENER_REMATES_REQUEST,
  OBTENER_REMATES_SUCCESS,
  OBTENER_REMATES_FAIL,
} from "./../types"
import axiosInstance from "../../../../services/axiosConfig";

export const obtenerListaRematesActions = (fDesde: string, fHasta: string, bod_corr: string, af_codigo_generico: string, establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: OBTENER_REMATES_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeRemates?fDesde=${fDesde}&fHasta=${fHasta}&bod_corr=${bod_corr}&af_codigo_generico=${af_codigo_generico}&establ_corr=${establ_corr}`);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: OBTENER_REMATES_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: OBTENER_REMATES_FAIL,
          error: "Listado sin información",
        });
        return false;
      }
    } else {
      dispatch({
        type: OBTENER_REMATES_FAIL,
        error:
          "No se pudo obtener el listado de altas. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: OBTENER_REMATES_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
