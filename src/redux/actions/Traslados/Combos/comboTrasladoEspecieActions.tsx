import {
  TRASLADO_ESPECIE_REQUEST,
  TRASLADO_ESPECIE_SUCCESS,
  TRASLADO_ESPECIE_FAIL
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboTrasladoEspecieActions = (establ_corr: number) => async (dispatch: Dispatch) => {

  dispatch({ type: TRASLADO_ESPECIE_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeTrasladoEspecie?establ_corr=${establ_corr}`);

    if (res.status === 200) {
      dispatch({
        type: TRASLADO_ESPECIE_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({ type: TRASLADO_ESPECIE_FAIL });
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({ type: TRASLADO_ESPECIE_FAIL });
  }
};
