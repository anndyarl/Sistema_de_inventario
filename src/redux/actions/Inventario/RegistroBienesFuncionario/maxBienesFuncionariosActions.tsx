import { Dispatch } from "redux";
import axios from "axios";
import {
  MAX_BIENES_FUNCIONARIOS_REQUEST,
  MAX_BIENES_FUNCIONARIOS_SUCCESS,
  MAX_BIENES_FUNCIONARIOS_FAIL,
} from "../types";

// Acción para obtener la recepción por número
export const maxBienesFuncionariosActions = (establ_corr: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: MAX_BIENES_FUNCIONARIOS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeMaxBF?establ_corr=${establ_corr}`, config);

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
        // error: "El token ha expirado.",
      });
      return false;
    }
  } else {
    dispatch({
      type: MAX_BIENES_FUNCIONARIOS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
