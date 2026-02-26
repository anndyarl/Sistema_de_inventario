import { Dispatch } from "redux";
import {
  QUITAR_ETIQUETAS_REQUEST,
  QUITAR_ETIQUETAS_SUCCESS,
  QUITAR_ETIQUETAS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const quitarEtiquetasActions = (etiquetas: Record<number, any>[]) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!etiquetas || Object.keys(etiquetas).length === 0) {
    return false;
  }
  const body = JSON.stringify(etiquetas);

  dispatch({ type: QUITAR_ETIQUETAS_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/ActualizaEtiqueta`, body);

    if (res.status === 200) {
      dispatch({
        type: QUITAR_ETIQUETAS_SUCCESS
      });
      return true;
    } else {
      dispatch({
        type: QUITAR_ETIQUETAS_FAIL,
        error:
          "No se pudo registrar en remates la lista seleccionada. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: QUITAR_ETIQUETAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
