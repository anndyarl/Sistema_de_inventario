import {
  CUENTA_MODIFICAR_REQUEST,
  CUENTA_MODIFICAR_SUCCESS,
  CUENTA_MODIFICAR_FAIL
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboCuentaModificarActions = (ESP_CODIGO: string) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: CUENTA_MODIFICAR_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeCuentaXEspecie?ESP_CODIGO=${ESP_CODIGO}`);

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
};
