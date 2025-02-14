import axios from "axios";
import {
  COMBO_M_SERVICIO_REQUEST,
  COMBO_M_SERVICIO_SUCCESS,
  COMBO_M_SERVICIO_FAIL
} from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const comboServicioMantenedorActions = () => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: COMBO_M_SERVICIO_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeServicio`, config);

      if (res.status === 200) {
        dispatch({
          type: COMBO_M_SERVICIO_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({ type: COMBO_M_SERVICIO_FAIL });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: COMBO_M_SERVICIO_FAIL });
    }
  } else {
    dispatch({ type: COMBO_M_SERVICIO_FAIL });
  }
};
