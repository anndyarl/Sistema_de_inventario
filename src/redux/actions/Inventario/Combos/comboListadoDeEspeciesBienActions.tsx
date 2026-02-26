import {
  LISTADO_ESPECIES_BIEN_REQUEST,
  LISTADO_ESPECIES_BIEN_SUCCESS,
  LISTADO_ESPECIES_BIEN_FAIL,
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboListadoDeEspeciesBienActions = (EST: number, IDBIEN: string) => async (dispatch: Dispatch) => {

  dispatch({ type: LISTADO_ESPECIES_BIEN_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboListadoDeEspeciesBienPar?EST=${EST}&IDBIEN=${IDBIEN}`);

    if (res.status === 200) {
      dispatch({
        type: LISTADO_ESPECIES_BIEN_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({ type: LISTADO_ESPECIES_BIEN_FAIL });
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({ type: LISTADO_ESPECIES_BIEN_FAIL });
  }
};
