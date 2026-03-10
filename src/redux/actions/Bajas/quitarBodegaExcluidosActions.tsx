import { Dispatch } from "redux";
import {
  QUITAR_BODEGA_EXCLUIDOS_REQUEST,
  QUITAR_BODEGA_EXCLUIDOS_SUCCESS,
  QUITAR_BODEGA_EXCLUIDOS_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

// Acción para obtener la recepción por número
export const quitarBodegaExcluidosActions = (listaQuitar: Record<string, any>[]) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!listaQuitar || Object.keys(listaQuitar).length === 0) {
    return false;
  }
  const body = JSON.stringify(listaQuitar);

  dispatch({ type: QUITAR_BODEGA_EXCLUIDOS_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/QuitarBodegaExcluido`, body);

    if (res.status === 200) {
      dispatch({
        type: QUITAR_BODEGA_EXCLUIDOS_SUCCESS
      });
      return true;
    } else {
      dispatch({
        type: QUITAR_BODEGA_EXCLUIDOS_FAIL,
        error:
          "No se pudo registrar en remates la lista seleccionada. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: QUITAR_BODEGA_EXCLUIDOS_FAIL,
      error: "Error en la solicitud. Por favor, intente nuevamente.",
    });
    return false;
  }
};
