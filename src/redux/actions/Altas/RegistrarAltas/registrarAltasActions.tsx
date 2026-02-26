import { Dispatch } from "redux";
import {
  REGISTRAR_ALTAS_REQUEST,
  REGISTRAR_ALTAS_SUCCESS,
  REGISTRAR_ALTAS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const registrarAltasActions = (activos: { AF_CLAVE: number }[]) => async (dispatch: Dispatch): Promise<boolean> => {

  const body = JSON.stringify(activos);

  dispatch({ type: REGISTRAR_ALTAS_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearAltas`, body);

    if (res.status === 200) {
      dispatch({
        type: REGISTRAR_ALTAS_SUCCESS,
        payload: res.data
      });
      return true;
    } else {
      dispatch({
        type: REGISTRAR_ALTAS_FAIL,
        error:
          "No se pudo anular la alta seleccionada. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: REGISTRAR_ALTAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
}
