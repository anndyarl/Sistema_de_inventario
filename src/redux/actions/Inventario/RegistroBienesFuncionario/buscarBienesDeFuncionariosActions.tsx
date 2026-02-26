import { Dispatch } from "redux";
import {
  BUSCAR_BIENES_FUNCIONARIOS_REQUEST,
  BUSCAR_BIENES_FUNCIONARIOS_SUCCESS,
  BUSCAR_BIENES_FUNCIONARIOS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const buscarBienesDeFuncionariosActions = (establ_corr: number) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: BUSCAR_BIENES_FUNCIONARIOS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/BuscarBienesFuncionarios?establ_corr=${establ_corr}`);

    if (res.status === 200) {
      dispatch({
        type: BUSCAR_BIENES_FUNCIONARIOS_SUCCESS,
        payload: res.data,
      });
      return true;
    } else {
      dispatch({
        type: BUSCAR_BIENES_FUNCIONARIOS_FAIL,
        error:
          "No se pudo obtener el listado de bienes funcionarios. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: BUSCAR_BIENES_FUNCIONARIOS_FAIL,
    });
    return false;
  }
};
