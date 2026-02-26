import { Dispatch } from "redux";
import {
  LISTA_TRASPASOS_REQUEST,
  LISTA_TRASPASOS_SUCCESS,
  LISTA_TRASPASOS_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

export const listadoTraspasosEnviadosActions = (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number, usuario_crea: number, pas_estado_recibe: string) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_TRASPASOS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeListaDeTraspasosEnviados?fDesde=${fDesde}&fHasta=${fHasta}&af_codigo_generico=${af_codigo_generico}&tras_corr=${tras_corr}&establ_corr=${establ_corr}&usuario_crea=${usuario_crea}&pas_estado_recibe=${pas_estado_recibe}`);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_TRASPASOS_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: LISTA_TRASPASOS_FAIL,
          error:
            "Status 200, pero con arreglo de datos vacío",
        });
        return false;
      }
    } else {
      dispatch({
        type: LISTA_TRASPASOS_SUCCESS,
        error:
          "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: LISTA_TRASPASOS_SUCCESS,
    });
    return false;
  }
};
