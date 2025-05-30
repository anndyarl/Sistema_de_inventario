import { Dispatch } from "redux";
import axios from "axios";
import {
  OBTENER_FIRMAS_ALTAS_REQUEST,
  OBTENER_FIRMAS_ALTAS_SUCCESS,
  OBTENER_FIRMAS_ALTAS_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const obtenerfirmasAltasActions = () => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: OBTENER_FIRMAS_ALTAS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeFirmantes`, config);
      if (res.status === 200) {
        dispatch({
          type: OBTENER_FIRMAS_ALTAS_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: OBTENER_FIRMAS_ALTAS_FAIL,
          error:
            "No se pudo obtener los datos solicitados. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: OBTENER_FIRMAS_ALTAS_FAIL,
        error: "Error en la solicitud:", err,
      });
      return false;
    }
  } else {
    dispatch({
      type: OBTENER_FIRMAS_ALTAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};