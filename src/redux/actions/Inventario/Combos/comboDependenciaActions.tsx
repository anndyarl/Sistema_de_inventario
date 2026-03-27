
import {
  DEPENDENCIA_REQUEST,
  DEPENDENCIA_SUCCESS,
  DEPENDENCIA_FAIL,
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboDependenciaActions = (serCorr: number) => async (dispatch: Dispatch) => {

  dispatch({ type: DEPENDENCIA_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/traeDependencias?ser_corr=${serCorr}`);

    if (res.status === 200) {
      dispatch({
        type: DEPENDENCIA_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({ type: DEPENDENCIA_FAIL });
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({ type: DEPENDENCIA_FAIL });
  }

};
