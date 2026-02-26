import { Dispatch } from "redux";
import {
  REGISTRAR_EXCLUIDOS_REQUEST,
  REGISTRAR_EXCLUIDOS_SUCCESS,
  REGISTRAR_EXCLUIDOS_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

export const excluirBajasActions = (listaExcluir: Record<string, any>[]) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!listaExcluir || Object.keys(listaExcluir).length === 0) {
    return false;
  }
  const body = JSON.stringify(listaExcluir);

  dispatch({ type: REGISTRAR_EXCLUIDOS_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CreaBodegaExcluido`, body);

    if (res.status === 200) {
      dispatch({
        type: REGISTRAR_EXCLUIDOS_SUCCESS
      });
      return true;
    } else {
      dispatch({
        type: REGISTRAR_EXCLUIDOS_FAIL,
        error:
          "No se pudo registrar en remates la lista seleccionada. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: REGISTRAR_EXCLUIDOS_FAIL,
      error: "Error en la solicitud. Por favor, intente nuevamente.",
    });
    return false;
  }
};
