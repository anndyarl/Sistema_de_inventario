import {
  ORIGEN_REQUEST,
  ORIGEN_SUCCESS,
  ORIGEN_FAIL
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboOrigenPresupuestosActions = () => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: ORIGEN_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeOrigen`);

    if (res.status === 200) {
      dispatch({
        type: ORIGEN_SUCCESS,
        payload: res.data,
      });
      return true;
    } else {
      dispatch({ type: ORIGEN_FAIL });
      return false;
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({ type: ORIGEN_FAIL });
    return false;
  }
};
