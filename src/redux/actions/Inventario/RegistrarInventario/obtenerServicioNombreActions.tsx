import { Dispatch } from "redux";
import axios from "axios";
import {
  OBTENER_SERVICIO_NOMBRE_REQUEST,
  OBTENER_SERVICIO_NOMBRE_SUCCESS,
  OBTENER_SERVICIO_NOMBRE_FAIL
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const obtenerServicioNombreActions = (dep_corr: number) => async (dispatch: Dispatch, getState: any): Promise<Boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: OBTENER_SERVICIO_NOMBRE_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeServicioNombre?dep_corr=${dep_corr}`, config);

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
        error: "El token ha expirado.",
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: OBTENER_SERVICIO_NOMBRE_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};

