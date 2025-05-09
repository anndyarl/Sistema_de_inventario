import { Dispatch } from "redux";
import axios from "axios";
import {
  OBTENER_REMATES_REQUEST,
  OBTENER_REMATES_SUCCESS,
  OBTENER_REMATES_FAIL,
} from "./../types"
import { LOGOUT } from "../../auth/types";

export const obtenerListaRematesActions = (fDesde: string, fHasta: string, nresolucion: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: OBTENER_REMATES_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeRemates?fDesde=${fDesde}&fHasta=${fHasta}&nresolucion=${nresolucion}`, config);

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
    } catch (err: any) {
      dispatch({
        type: OBTENER_REMATES_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: OBTENER_REMATES_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
