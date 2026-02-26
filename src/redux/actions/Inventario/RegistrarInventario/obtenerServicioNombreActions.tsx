import { Dispatch } from "redux";
import axios from "axios";
import {
  OBTENER_SERVICIO_NOMBRE_REQUEST,
  OBTENER_SERVICIO_NOMBRE_SUCCESS,
  OBTENER_SERVICIO_NOMBRE_FAIL
} from "../types";

export const obtenerServicioNombreActions = (dep_corr: number) => async (dispatch: Dispatch): Promise<Boolean> => {

  dispatch({ type: OBTENER_SERVICIO_NOMBRE_REQUEST });

  try {
    const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeServicioNombre?dep_corr=${dep_corr}`);

    if (res.status === 200) {
      dispatch({
        type: OBTENER_SERVICIO_NOMBRE_SUCCESS,
        payload: res.data,
      });
      return true;
    } else {
      dispatch({
        type: OBTENER_SERVICIO_NOMBRE_FAIL,
        error: "No se pudo obtener los datos. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: OBTENER_SERVICIO_NOMBRE_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};

