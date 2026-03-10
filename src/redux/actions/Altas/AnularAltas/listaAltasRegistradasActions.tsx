import { Dispatch } from "redux";
import {
  OBTENER_ALTAS_REGISTRADAS_REQUEST,
  OBTENER_ALTAS_REGISTRADAS_SUCCESS,
  OBTENER_ALTAS_REGISTRADAS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const listaAltasRegistradasActions = (fDesde: string, fHasta: string, af_codigo_generico: string, altasCorr: number, idocumento: number, establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: OBTENER_ALTAS_REGISTRADAS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeAltas?fDesde=${fDesde}&fHasta=${fHasta}&af_codigo_generico=${af_codigo_generico}&altasCorr=${altasCorr}&idocumento=${idocumento}&establ_corr=${establ_corr}`);
    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: OBTENER_ALTAS_REGISTRADAS_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: OBTENER_ALTAS_REGISTRADAS_FAIL,
          error: "Status 200, pero con arreglo de datos vacío",
        });
        return false;
      }
    } else {
      dispatch({
        type: OBTENER_ALTAS_REGISTRADAS_FAIL,
        error:
          "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: OBTENER_ALTAS_REGISTRADAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    // dispatch({ type: LOGOUT });
    return false;
  }

};
