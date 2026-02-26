import {
  COMBO_DEPENDENCIA_DESTINO_REQUEST,
  COMBO_DEPENDENCIA_DESTINO_SUCCESS,
  COMBO_DEPENDENCIA_DESTINO_FAIL,
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboDependenciaDestinoActions = (serCorr: string) => async (dispatch: Dispatch) => {

  dispatch({ type: COMBO_DEPENDENCIA_DESTINO_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/traeDependencias?ser_corr=${serCorr}`);

    if (res.status === 200) {
      dispatch({
        type: COMBO_DEPENDENCIA_DESTINO_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({ type: COMBO_DEPENDENCIA_DESTINO_FAIL });
    }
  } catch (err) {
    dispatch({ type: COMBO_DEPENDENCIA_DESTINO_FAIL });
  }
};
