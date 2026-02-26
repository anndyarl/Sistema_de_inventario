import { Dispatch } from "redux";
import { RECEPCION_REQUEST, RECEPCION_SUCCESS, RECEPCION_FAIL } from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const obtenerRecepcionActions = (nRecepcion: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: RECEPCION_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeRecepcion?numero=${nRecepcion}`);
    if (res.status === 200) {
      const isEmpty = res.data && Object.values(res.data).every((value) => value === 0 || value === null || value === undefined);
      if (!isEmpty) {
        dispatch({
          type: RECEPCION_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: RECEPCION_FAIL,
          error: "No se pudo obtener los datos. Por favor, intente nuevamente.",
        });
        return false;
      }
    } else {
      dispatch({
        type: RECEPCION_FAIL,
        error:
          "No se pudo obtener el inventario. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: RECEPCION_FAIL,
      error: "Error en la solicitud:", err,
    });

    return false;
  }
};
