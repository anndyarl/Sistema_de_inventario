import { Dispatch } from "redux";
import {
  OBTENER_FIRMAS_ALTAS_REQUEST,
  OBTENER_FIRMAS_ALTAS_SUCCESS,
  OBTENER_FIRMAS_ALTAS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const obtenerfirmasAltasActions = () => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: OBTENER_FIRMAS_ALTAS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeFirmantes`);
    if (res.status === 200) {
      dispatch({
        type: OBTENER_FIRMAS_ALTAS_SUCCESS,
        payload: res.data,
      });
      return true;
    } else {
      dispatch({
        type: OBTENER_FIRMAS_ALTAS_FAIL,
        error:
          "No se pudo obtener los datos solicitados. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: OBTENER_FIRMAS_ALTAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};