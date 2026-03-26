import { Dispatch } from "redux";
import {
  LISTA_TRASLADOS_ADJUNTOS_REQUEST,
  LISTA_TRASLADOS_ADJUNTOS_SUCCESS,
  LISTA_TRASLADOS_ADJUNTOS_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

export const obtenerAdjuntosActions = (numTraslados: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_TRASLADOS_ADJUNTOS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeTrasladosAdjuntos?numTraslados=${numTraslados}`);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_TRASLADOS_ADJUNTOS_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: LISTA_TRASLADOS_ADJUNTOS_FAIL,
          error:
            "Status 200, pero con arreglo de datos vacío",
        });
        return false;
      }
    } else {
      dispatch({
        type: LISTA_TRASLADOS_ADJUNTOS_SUCCESS,
        error:
          "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: LISTA_TRASLADOS_ADJUNTOS_SUCCESS,
    });
    return false;
  }
};
