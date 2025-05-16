import axios from "axios";
import {
  CUENTA_MODIFICAR_REQUEST,
  CUENTA_MODIFICAR_SUCCESS,
  CUENTA_MODIFICAR_FAIL
} from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const comboCuentaModificarActions = (ESP_CODIGO: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: CUENTA_MODIFICAR_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeCuentaXEspecie?ESP_CODIGO=${ESP_CODIGO}`, config);

      if (res.status === 200) {
        dispatch({
          type: CUENTA_MODIFICAR_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({ type: CUENTA_MODIFICAR_FAIL });
        return false;
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: CUENTA_MODIFICAR_FAIL });
      return false;
    }
  } else {
    dispatch({ type: CUENTA_MODIFICAR_FAIL });
    return false;
  }
};
