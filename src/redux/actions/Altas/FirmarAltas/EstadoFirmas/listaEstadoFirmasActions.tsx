import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_ESTADO_FIRMAS_REQUEST,
  LISTA_ESTADO_FIRMAS_SUCCESS,
  LISTA_ESTADO_FIRMAS_FAIL,
} from "../../types";
import { LOGOUT } from "../../../auth/types";

// Acción para obtener la recepción por número
export const listaEstadoFirmasActions = (altas_corr: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: LISTA_ESTADO_FIRMAS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeFirmaAltas?altas_corr=${altas_corr}`, config);
      if (res.status === 200) {
        dispatch({
          type: LISTA_ESTADO_FIRMAS_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: LISTA_ESTADO_FIRMAS_FAIL,
          error:
            "No se pudo obtener los datos solicitados. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: LISTA_ESTADO_FIRMAS_FAIL,
        error: "Error en la solicitud:", err,
      });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_ESTADO_FIRMAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};