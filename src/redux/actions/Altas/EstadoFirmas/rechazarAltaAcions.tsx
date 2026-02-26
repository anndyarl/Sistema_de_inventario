import { Dispatch } from "redux";
import {
  RECHAZAR_ALTA_REQUEST,
  RECHAZAR_ALTA_SUCCESS,
  RECHAZAR_ALTA_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const rechazarAltaActions = (documento: number) => async (dispatch: Dispatch): Promise<boolean> => {

  const body = JSON.stringify(documento);

  dispatch({ type: RECHAZAR_ALTA_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/RechazarAlta`, body);

    if (res.status === 200) {
      dispatch({
        type: RECHAZAR_ALTA_SUCCESS,
        payload: res.data
      });
      return true;
    } else {
      dispatch({
        type: RECHAZAR_ALTA_FAIL,
        error:
          "No se pudo rechazar la alta seleccionada. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: RECHAZAR_ALTA_FAIL,
      error: "Error en la solicitud:", err,
    });

    return false;
  }

};
