import axios from "axios";
import {
  COMBO_ESPECIES_BIEN_REQUEST,
  COMBO_ESPECIES_BIEN_SUCCESS,
  COMBO_ESPECIES_BIEN_FAIL,
} from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const comboEspeciesBienActions = (EST: number, IDBIEN: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: COMBO_ESPECIES_BIEN_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboListadoDeEspeciesBienPar?EST=${EST}&IDBIEN=${IDBIEN}`, config);

      if (res.status === 200) {
        dispatch({
          type: COMBO_ESPECIES_BIEN_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({ type: COMBO_ESPECIES_BIEN_FAIL });
        return false;
      }
    } catch (err) {
      // console.error("Error en la solicitud:", err);
      dispatch({ type: COMBO_ESPECIES_BIEN_FAIL });
      return false;
    }
  } else {
    dispatch({ type: COMBO_ESPECIES_BIEN_FAIL });
    return false;
  }
};
