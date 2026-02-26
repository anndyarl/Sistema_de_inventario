import { Dispatch } from "redux";
import {
  DEVOLVER_BAJAS_REQUEST,
  DEVOLVER_BAJAS_SUCCESS,
  DEVOLVER_BAJAS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const devolverBajasActions = (devolverBaja: Record<string, any>[]) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!devolverBaja || Object.keys(devolverBaja).length === 0) {
    return false;
  }
  const body = JSON.stringify(devolverBaja);

  dispatch({ type: DEVOLVER_BAJAS_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/DevolverBaja`, body);

    if (res.status === 200) {
      dispatch({
        type: DEVOLVER_BAJAS_SUCCESS,
        payload: res.data
      });
      return true;
    } else {
      dispatch({
        type: DEVOLVER_BAJAS_FAIL,
        error: "Listado sin información",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: DEVOLVER_BAJAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
