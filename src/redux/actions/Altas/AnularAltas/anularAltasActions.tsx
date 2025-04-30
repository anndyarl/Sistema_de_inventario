import { Dispatch } from "redux";
import axios from "axios";
import {
  ANULAR_ALTAS_REQUEST,
  ANULAR_ALTAS_SUCCESS,
  ANULAR_ALTAS_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const anularAltasActions = (activos: { aF_CLAVE: number }[]) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(activos);
    dispatch({ type: ANULAR_ALTAS_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/AnularAltas`, body, config);

      if (res.status === 200) {
        dispatch({
          type: ANULAR_ALTAS_SUCCESS
        });
        return true;
      } else {
        dispatch({
          type: ANULAR_ALTAS_FAIL,
          error: "No se pudo anular la alta seleccionada. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: ANULAR_ALTAS_FAIL,
        error: "El token ha expirado.",
      });
      dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: ANULAR_ALTAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
