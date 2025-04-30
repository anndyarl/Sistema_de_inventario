import { Dispatch } from "redux";
import axios from "axios";
import {
  OBTENER_UNIDADES_REQUEST,
  OBTENER_UNIDADES_SUCCESS,
  OBTENER_UNIDADES_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const obtenerUnidadesActions = () => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: OBTENER_UNIDADES_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeUnidades`, config);
      if (res.status === 200) {
        dispatch({
          type: OBTENER_UNIDADES_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: OBTENER_UNIDADES_FAIL,
          error:
            "No se pudo obtener los datos solicitados. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: OBTENER_UNIDADES_FAIL,
        error: "El token ha expirado.",
      });
      dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: OBTENER_UNIDADES_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
