import { Dispatch } from "redux";
import {
  REGISTRAR_REMATES_REQUEST,
  REGISTRAR_REMATES_SUCCESS,
  REGISTRAR_REMATES_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

export const rematarBajasActions = (activos: Record<string, any>[]) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!activos || Object.keys(activos).length === 0) {
    // console.error("El objeto datosInventario está vacío.");
    return false;
  }
  const body = JSON.stringify(activos);

  dispatch({ type: REGISTRAR_REMATES_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CreaRemates`, body);

    if (res.status === 200) {
      dispatch({
        type: REGISTRAR_REMATES_SUCCESS
      });
      return true;
    } else {
      dispatch({
        type: REGISTRAR_REMATES_FAIL,
        error:
          "No se pudo registrar en remates la lista seleccionada. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: REGISTRAR_REMATES_FAIL,
      error: "Error en la solicitud. Por favor, intente nuevamente.",
    });
    return false;
  }
};
