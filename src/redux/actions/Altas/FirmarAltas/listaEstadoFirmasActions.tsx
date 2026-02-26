import { Dispatch } from "redux";
import {
  LISTA_ESTADO_FIRMAS_REQUEST,
  LISTA_ESTADO_FIRMAS_SUCCESS,
  LISTA_ESTADO_FIRMAS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const listaEstadoFirmasActions = (altas_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_ESTADO_FIRMAS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeEstadoFirmaAltas?altas_corr=${altas_corr}`);
    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_ESTADO_FIRMAS_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: LISTA_ESTADO_FIRMAS_FAIL,
          error:
            "No se pudo obtener los datos solicitados. Por favor, intente nuevamente.",
        });
        return false;
      }
    } else {
      dispatch({
        type: LISTA_ESTADO_FIRMAS_FAIL,
        error:
          "No se pudo obtener el listado. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: LISTA_ESTADO_FIRMAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};