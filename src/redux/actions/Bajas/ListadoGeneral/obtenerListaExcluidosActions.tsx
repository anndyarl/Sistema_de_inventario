import { Dispatch } from "redux";
import axios from "axios";
import {
  OBTENER_EXCLUIDOS_REQUEST,
  OBTENER_EXCLUIDOS_SUCCESS,
  OBTENER_EXCLUIDOS_FAIL,
} from "./../types"
import { LOGOUT } from "../../auth/types";

export const obtenerListaExcluidosActions = (fDesde: string, fHasta: string, nresolucion: string, af_codigo_generico: string, establ_corr: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: OBTENER_EXCLUIDOS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeBodegaExcluido?fDesde=${fDesde}&fHasta=${fHasta}&nresolucion=${nresolucion}&af_codigo_generico=${af_codigo_generico}&establ_corr=${establ_corr}`, config);
      const data = res.data;
      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: OBTENER_EXCLUIDOS_SUCCESS,
            payload: data ? data : [],
          });
          return true;
        } else {
          dispatch({
            type: OBTENER_EXCLUIDOS_FAIL,
            error: "Listado sin información",
          });
          return false;
        }
      } else {
        dispatch({
          type: OBTENER_EXCLUIDOS_FAIL,
          error: "No se pudo obtener el listado de altas. Por favor, intente nuevamente.",
          payload: []
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: OBTENER_EXCLUIDOS_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: OBTENER_EXCLUIDOS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
