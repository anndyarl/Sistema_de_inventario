import { Dispatch } from "redux";
import {
  ANULAR_INVENTARIO_REQUEST,
  ANULAR_INVENTARIO_SUCCESS,
  ANULAR_INVENTARIO_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const anularInventarioActions = (aF_CLAVE: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: ANULAR_INVENTARIO_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/AnulaInventario?aF_CLAVE=${aF_CLAVE}`);

    if (res.status === 200) {
      dispatch({
        type: ANULAR_INVENTARIO_SUCCESS,
        payload: res.data,
      });
      return true;
    } else {
      dispatch({
        type: ANULAR_INVENTARIO_FAIL,
        error:
          "No se pudo anular el inventario. Por favor, intente nuevamente.",
      });
      return false;
    }

  } catch (err: any) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: ANULAR_INVENTARIO_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
