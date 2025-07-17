import { Dispatch } from "redux";
import axios from "axios";
import {
  QUITAR_ETIQUETAS_REQUEST,
  QUITAR_ETIQUETAS_SUCCESS,
  QUITAR_ETIQUETAS_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const quitarEtiquetasActions = (etiquetas: Record<number, any>[]) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    if (!etiquetas || Object.keys(etiquetas).length === 0) {
      // console.error("El objeto datosInventario está vacío.");
      return false;
    }
    const body = JSON.stringify(etiquetas);

    dispatch({ type: QUITAR_ETIQUETAS_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/ActualizaEtiqueta`, body, config);

      if (res.status === 200) {
        dispatch({
          type: QUITAR_ETIQUETAS_SUCCESS
        });
        return true;
      } else {
        dispatch({
          type: QUITAR_ETIQUETAS_FAIL,
          error:
            "No se pudo registrar en remates la lista seleccionada. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: QUITAR_ETIQUETAS_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: QUITAR_ETIQUETAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
