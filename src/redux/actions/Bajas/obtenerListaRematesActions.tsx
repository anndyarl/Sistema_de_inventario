import { Dispatch } from "redux";
import axios from "axios";
import {
  OBTENER_REMATES_REQUEST,
  OBTENER_REMATES_SUCCESS,
  OBTENER_REMATES_FAIL,
} from "./types"

export const obtenerListaRematesActions = (af_clave: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
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
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeRemates?af_clave=${af_clave}`, config);

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
  } else {
    dispatch({
      type: OBTENER_REMATES_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
