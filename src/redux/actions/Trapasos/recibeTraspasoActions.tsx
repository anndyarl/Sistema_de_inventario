import { Dispatch } from "redux";
import axios from "axios";
import {
  TRASPASO_ESTADO_RECIBE_REQUEST,
  TRASPASO_ESTADO_RECIBE_SUCCESS,
  TRASPASO_ESTADO_RECIBE_FAIL,
} from "./types";

export const recibeTraspasoActions = (RecibeTraspaso: Record<string, any>) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; // Token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    if (!RecibeTraspaso || Object.keys(RecibeTraspaso).length === 0) {
      // console.error("El objeto datosInventario está vacío.");
      return false;
    }
    const body = JSON.stringify(RecibeTraspaso);

    dispatch({ type: TRASPASO_ESTADO_RECIBE_REQUEST });

    try {
      const response = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/RecibeTraspasos/`, body, config);

      if (response.status === 200) {
        if (response.data === 1) {
          dispatch({
            type: TRASPASO_ESTADO_RECIBE_SUCCESS,
            payload: response.data,
          });
          return true;
        }
        else {
          dispatch({
            type: TRASPASO_ESTADO_RECIBE_SUCCESS,
            payload: response.data,
          });
          return false;
        }

      } else {
        dispatch({
          type: TRASPASO_ESTADO_RECIBE_FAIL,
          error: "No se pudo obtener el inventario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: TRASPASO_ESTADO_RECIBE_FAIL,
        error: "Error en la solicitud:", err,
      });
      return false;
    }
  } else {
    dispatch({
      type: TRASPASO_ESTADO_RECIBE_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
