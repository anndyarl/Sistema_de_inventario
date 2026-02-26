import { Dispatch } from "redux";
import {
  MAX_BIENES_FUNCIONARIOS_REQUEST,
  MAX_BIENES_FUNCIONARIOS_SUCCESS,
  MAX_BIENES_FUNCIONARIOS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const maxBienesFuncionariosActions = (establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: MAX_BIENES_FUNCIONARIOS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeMaxBF?establ_corr=${establ_corr}`);

    if (res.status === 200) {
      dispatch({
        type: MAX_BIENES_FUNCIONARIOS_SUCCESS,
        payload: res.data,
      });
      return true;
    } else {
      dispatch({
        type: MAX_BIENES_FUNCIONARIOS_FAIL,
        error:
          "No se pudo obtener max de bienes funcionarios. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: MAX_BIENES_FUNCIONARIOS_FAIL,
    });
    return false;
  }
};
