import { Dispatch } from "redux";
import axios from "axios";
import {
  REGISTRAR_REMATES_REQUEST,
  REGISTRAR_REMATES_SUCCESS,
  REGISTRAR_REMATES_FAIL,
} from "./../types";

export const rematarBajasActions = (activos: Record<string, any>[]) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!activos || Object.keys(activos).length === 0) {
    return false;
  }
  const body = JSON.stringify(activos);

  dispatch({ type: REGISTRAR_REMATES_REQUEST });

  try {
    const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CreaRemates`, body);

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
  } catch (err: any) {
    dispatch({
      type: REGISTRAR_REMATES_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
