import {
  MODALIDAD_COMPRA_REQUEST,
  MODALIDAD_COMPRA_SUCCESS,
  MODALIDAD_COMPRA_FAIL,
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboModalidadesActions = () => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: MODALIDAD_COMPRA_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeModalidad`);

    if (res.status === 200) {
      dispatch({
        type: MODALIDAD_COMPRA_SUCCESS,
        payload: res.data,
      });
      return true;
    } else {
      dispatch({ type: MODALIDAD_COMPRA_FAIL });
      return false;
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({ type: MODALIDAD_COMPRA_FAIL });
    return false;
  }
};
