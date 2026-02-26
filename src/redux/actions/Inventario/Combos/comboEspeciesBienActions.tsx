import {
  COMBO_ESPECIES_BIEN_REQUEST,
  COMBO_ESPECIES_BIEN_SUCCESS,
  COMBO_ESPECIES_BIEN_FAIL,
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboEspeciesBienActions = (EST: number, IDBIEN: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: COMBO_ESPECIES_BIEN_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboListadoDeEspeciesBienPar?EST=${EST}&IDBIEN=${IDBIEN}`);

    if (res.status === 200) {
      dispatch({
        type: COMBO_ESPECIES_BIEN_SUCCESS,
        payload: res.data,
      });
      return true;
    } else {
      dispatch({ type: COMBO_ESPECIES_BIEN_FAIL });
      return false;
    }
  } catch (err) {
    // console.error("Error en la solicitud:", err);
    dispatch({ type: COMBO_ESPECIES_BIEN_FAIL });
    return false;
  }
};
