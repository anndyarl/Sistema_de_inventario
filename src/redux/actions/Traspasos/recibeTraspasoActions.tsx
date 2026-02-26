import { Dispatch } from "redux";
import {
  TRASPASO_ESTADO_RECIBE_REQUEST,
  TRASPASO_ESTADO_RECIBE_SUCCESS,
  TRASPASO_ESTADO_RECIBE_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

export const recibeTraspasoActions = (RecibeTraspaso: Record<string, any>) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!RecibeTraspaso || Object.keys(RecibeTraspaso).length === 0) {
    return false;
  }
  const body = JSON.stringify(RecibeTraspaso);

  dispatch({ type: TRASPASO_ESTADO_RECIBE_REQUEST });

  try {
    const response = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/RecibeTraspasos/`, body);

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

};
