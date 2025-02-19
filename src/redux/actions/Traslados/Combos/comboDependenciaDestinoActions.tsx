import axios from "axios";
import {
  COMBO_DEPENDENCIA_DESTINO_REQUEST,
  COMBO_DEPENDENCIA_DESTINO_SUCCESS,
  COMBO_DEPENDENCIA_DESTINO_FAIL,
} from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio

export const comboDependenciaDestinoActions = (serCorr: string) => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: COMBO_DEPENDENCIA_DESTINO_REQUEST });
    // const serCorr = 0; // O cualquier otro valor dinámico
    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/traeDependencias?ser_corr=${serCorr}`, config);

      if (res.status === 200) {
        dispatch({
          type: COMBO_DEPENDENCIA_DESTINO_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({ type: COMBO_DEPENDENCIA_DESTINO_FAIL });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: COMBO_DEPENDENCIA_DESTINO_FAIL });
    }
  } else {
    dispatch({ type: COMBO_DEPENDENCIA_DESTINO_FAIL });
  }
};
