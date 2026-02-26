import { Dispatch } from "redux";
import {
  ANULAR_ALTAS_REQUEST,
  ANULAR_ALTAS_SUCCESS,
  ANULAR_ALTAS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";


export const anularAltasActions = (activos: { aF_CLAVE: number }[]) => async (dispatch: Dispatch): Promise<boolean> => {

  const body = JSON.stringify(activos);
  dispatch({ type: ANULAR_ALTAS_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/AnularAltas`, body);

    if (res.status === 200) {
      dispatch({
        type: ANULAR_ALTAS_SUCCESS
      });
      return true;
    } else {
      dispatch({
        type: ANULAR_ALTAS_FAIL,
        error: "No se pudo anular la alta seleccionada. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: ANULAR_ALTAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }

};
