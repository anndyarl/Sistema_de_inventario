import { ESTABLECIMIENTO_REQUEST, ESTABLECIMIENTO_SUCCESS, ESTABLECIMIENTO_FAIL } from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboEstablecimientoActions = (establ_corr: number) => async (dispatch: Dispatch) => {

  dispatch({ type: ESTABLECIMIENTO_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraEstablecimientos?establ_corr=${establ_corr}`);

    if (res.status === 200) {
      dispatch({
        type: ESTABLECIMIENTO_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({ type: ESTABLECIMIENTO_FAIL });
    }
  } catch (err) {
    dispatch({ type: ESTABLECIMIENTO_FAIL });
  }
};
