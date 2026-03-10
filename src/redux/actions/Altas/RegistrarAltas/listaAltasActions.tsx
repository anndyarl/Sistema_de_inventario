import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";
import {
  OBTENER_ALTAS_REQUEST,
  OBTENER_ALTAS_SUCCESS,
  OBTENER_ALTAS_FAIL,
} from "../types";

export const listaAltasActions = (fDesde: string, fHasta: string, af_codigo_generico: string, altas_corr: number, establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: OBTENER_ALTAS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeAFAltas?fDesde=${fDesde}&fHasta=${fHasta}&af_codigo_generico=${af_codigo_generico}&altas_corr${altas_corr}&establ_corr=${establ_corr}`);
    if (res.status === 200) {
      dispatch({
        type: OBTENER_ALTAS_SUCCESS,
        payload: res.data
      });
      return true;
    } else {
      dispatch({
        type: OBTENER_ALTAS_FAIL,
        error:
          "No se pudo obtener las altas. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: OBTENER_ALTAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
}
