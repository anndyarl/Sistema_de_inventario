import {
  BIEN_REQUEST,
  BIEN_SUCCESS,
  BIEN_FAIL,
  BIEN_DETALLES_REQUEST,
  BIEN_DETALLES_SUCCESS,
  BIEN_DETALLES_FAIL,
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

// Acción para obtener servicio
export const comboDetalleActions = (idPadre: string) => async (dispatch: Dispatch) => {

  if (idPadre === "0") {
    dispatch({ type: BIEN_REQUEST });
  } else {
    dispatch({ type: BIEN_DETALLES_REQUEST });
  }

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeBienxPadre?idPadre=${idPadre}`);

    if (res.status === 200) {
      if (idPadre === "0") {
        dispatch({
          type: BIEN_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: BIEN_DETALLES_SUCCESS,
          payload: res.data,
        });
      }
    } else {
      if (idPadre === "0") {
        dispatch({ type: BIEN_FAIL });
      } else {
        dispatch({ type: BIEN_DETALLES_FAIL });
      }
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({ type: BIEN_DETALLES_FAIL });
  }
};
