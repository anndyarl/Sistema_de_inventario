
import {
  CUENTA_REQUEST,
  CUENTA_SUCCESS,
  CUENTA_FAIL
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboCuentaInicialActions = () => async (dispatch: Dispatch) => {

  dispatch({ type: CUENTA_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeCuentaInicial`);


    if (res.status === 200) {
      dispatch({
        type: CUENTA_SUCCESS,
        payload: res.data
      });
    } else {
      dispatch({ type: CUENTA_FAIL });
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({ type: CUENTA_FAIL });
  }
};
