import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_TRASPASOS_ADJUNTOS_REQUEST,
  LISTA_TRASPASOS_ADJUNTOS_SUCCESS,
  LISTA_TRASPASOS_ADJUNTOS_FAIL,
} from "./types";

// Acción para obtener la recepción por número
export const obtenerAdjuntosActions = (numTraspaso: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: LISTA_TRASPASOS_ADJUNTOS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeTraspasoAdjuntos?numTraspaso=${numTraspaso}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_TRASPASOS_ADJUNTOS_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
          dispatch({
            type: LISTA_TRASPASOS_ADJUNTOS_FAIL,
            error:
              "Status 200, pero con arreglo de datos vacío",
          });
          return false;
        }
      } else {
        dispatch({
          type: LISTA_TRASPASOS_ADJUNTOS_SUCCESS,
          error:
            "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: LISTA_TRASPASOS_ADJUNTOS_SUCCESS,
        // error: "El token ha expirado.",
      });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_TRASPASOS_ADJUNTOS_SUCCESS,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
