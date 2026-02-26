import { Dispatch } from "redux";
import {
  LISTA_TRASLADOS_REQUEST,
  LISTA_TRASLADOS_SUCCESS,
  LISTA_TRASLADOS_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

// Acción para obtener la recepción por número
export const listadoTrasladosActions = (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_TRASLADOS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeListaDeTraslados?fDesde=${fDesde}&fHasta=${fHasta}&af_codigo_generico=${af_codigo_generico}&tras_corr=${tras_corr}&establ_corr=${establ_corr}`);
    console.log(fDesde, fHasta, af_codigo_generico, tras_corr, establ_corr);
    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_TRASLADOS_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: LISTA_TRASLADOS_FAIL,
          error:
            "Status 200, pero con arreglo de datos vacío",
        });
        return false;
      }
    } else {
      dispatch({
        type: LISTA_TRASLADOS_FAIL,
        error:
          "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: LISTA_TRASLADOS_FAIL,
    });
    return false;
  }
};
