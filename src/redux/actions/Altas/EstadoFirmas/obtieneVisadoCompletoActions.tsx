import { Dispatch } from "redux";
import {
  OBTIENE_VISADO_COMPLETO_REQUEST,
  OBTIENE_VISADO_COMPLETO_SUCCESS,
  OBTIENE_VISADO_COMPLETO_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const obtieneVisadoCompletoActions = (idocumento: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: OBTIENE_VISADO_COMPLETO_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeDocAlta?idocumento=${idocumento}`);
    if (res.status === 200) {
      dispatch({
        type: OBTIENE_VISADO_COMPLETO_SUCCESS,
        payload: res.data,
      });
      return true;
    } else {
      dispatch({
        type: OBTIENE_VISADO_COMPLETO_FAIL,
        error:
          "No se pudo obtener los datos solicitados. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: OBTIENE_VISADO_COMPLETO_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};