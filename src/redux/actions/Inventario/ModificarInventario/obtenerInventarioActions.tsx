import { Dispatch } from "redux";
import {
  OBTENER_INVENTARIO_REQUEST,
  OBTENER_INVENTARIO_SUCCESS,
  OBTENER_INVENTARIO_FAIL
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const obtenerInventarioActions = (af_codigo_generico: string, estabL_CORR: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: OBTENER_INVENTARIO_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeInvxID?af_codigo_generico=${af_codigo_generico}&estabL_CORR=${estabL_CORR}`);

    if (res.status === 200) {
      const isEmpty = res.data && Object.values(res.data).every((value) => value === 0 || value === null || value === undefined);
      if (!isEmpty) {
        dispatch({
          type: OBTENER_INVENTARIO_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: OBTENER_INVENTARIO_FAIL,
          error: "No se pudo obtener los datos. Por favor, intente nuevamente.",
        });
        return false;
      }
    } else {
      dispatch({
        type: OBTENER_INVENTARIO_FAIL,
        error:
          "No se pudo obtener el inventario. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: OBTENER_INVENTARIO_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
