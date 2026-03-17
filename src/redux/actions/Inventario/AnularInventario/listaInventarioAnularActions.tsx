import { Dispatch } from "redux";
import {
  LISTA_INVENTARIO_ANULAR_REQUEST,
  LISTA_INVENTARIO_ANULAR_SUCCESS,
  LISTA_INVENTARIO_ANULAR_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const listaInventarioAnularActions = (af_codigo_generico: string, FechaInicio: string, FechaTermino: string, fechaIniF: string, estabL_CORR: number, af_precio: number, af_estado_inv: number | null) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_INVENTARIO_ANULAR_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/traeListaInventarioAnular?af_codigo_generico=${af_codigo_generico}&FechaInicio=${FechaInicio}&FechaTermino=${FechaTermino}&fechaIniF=${fechaIniF}&estabL_CORR=${estabL_CORR}&af_precio=${af_precio}&af_estado_inv=${af_estado_inv}`);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_INVENTARIO_ANULAR_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: LISTA_INVENTARIO_ANULAR_FAIL,
          error: "No se pudo obtener los datos. Por favor, intente nuevamente.",
        });
        return false;
      }
    } else {
      dispatch({
        type: LISTA_INVENTARIO_ANULAR_FAIL,
        error:
          "No se pudo obtener el listado de altas. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: LISTA_INVENTARIO_ANULAR_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
