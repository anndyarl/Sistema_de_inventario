import {
  DEPENDENCIA_MODIFICAR_REQUEST,
  DEPENDENCIA_MODIFICAR_SUCCESS,
  DEPENDENCIA_MODIFICAR_FAIL,
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboDependenciaModificarActions = (serCorr: string) => async (dispatch: Dispatch) => {

  dispatch({ type: DEPENDENCIA_MODIFICAR_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/traeDependencias?ser_corr=${serCorr}`);

    if (res.status === 200) {
      dispatch({
        type: DEPENDENCIA_MODIFICAR_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({ type: DEPENDENCIA_MODIFICAR_FAIL });
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({ type: DEPENDENCIA_MODIFICAR_FAIL });
  }
};
