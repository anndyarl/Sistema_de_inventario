import { Dispatch } from "redux";
import {
  OBTENER_REMATES_REQUEST,
  OBTENER_REMATES_SUCCESS,
  OBTENER_REMATES_FAIL,
} from "./types"
import axiosInstance from "../../../services/axiosConfig";

export const obtenerListaRematesActions = (fDesde: string, fHasta: string, nresolucion: string) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: OBTENER_REMATES_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeRemates?fDesde=${fDesde}&fHasta=${fHasta}&nresolucion=${nresolucion}`);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: OBTENER_REMATES_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
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
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: OBTENER_REMATES_FAIL,
      error: "Error en la solicitud. Por favor, intente nuevamente.",
    });
    return false;
  }
};
