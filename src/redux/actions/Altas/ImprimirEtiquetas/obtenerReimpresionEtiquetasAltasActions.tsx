import { Dispatch } from "redux";
import {
  REIMPRESION_ETIQUETAS_ALTAS_REQUEST,
  REIMPRESION_ETIQUETAS_ALTAS_SUCCESS,
  REIMPRESION_ETIQUETAS_ALTAS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const obtenerReimpresionEtiquetasAltasActions = (fDesde: string, fHasta: string, establ_corr: number, altasCorr: number, af_codigo_generico: string, dep_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: REIMPRESION_ETIQUETAS_ALTAS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/DatosReimprimirEtiquetas?fDesde=${fDesde}&fHasta=${fHasta}&establ_corr=${establ_corr}&altasCorr=${altasCorr}&af_codigo_generico=${af_codigo_generico}&dep_corr=${dep_corr}`);
    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: REIMPRESION_ETIQUETAS_ALTAS_SUCCESS,
          payload: res.data
        });
        return true;
      } else {
        dispatch({
          type: REIMPRESION_ETIQUETAS_ALTAS_FAIL,
          error:
            "No se pudo obtener los datos solicitados. Por favor, intente nuevamente.",
        });
        return false;
      }
    } else {
      dispatch({
        type: REIMPRESION_ETIQUETAS_ALTAS_FAIL,
        error:
          "No se pudo obtener los datos solicitados. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: REIMPRESION_ETIQUETAS_ALTAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
