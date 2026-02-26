import { Dispatch } from "redux";
import {
  LISTA_ALTAS_REQUEST,
  LISTA_ALTAS_SUCCESS,
  LISTA_ALTAS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const listaAltasActions = () => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_ALTAS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeAFAltas`);
    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_ALTAS_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: LISTA_ALTAS_FAIL,
          error:
            "Status 200, pero con arreglo de datos vacío",
        });
        return false;
      }
    } else {
      dispatch({
        type: LISTA_ALTAS_FAIL,
        error:
          "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err) {
    dispatch({
      type: LISTA_ALTAS_FAIL,
      error: "Error en la solicitud. Por favor, intente nuevamente.",
    });
    return false;
  }
};
