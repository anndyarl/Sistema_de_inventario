import { Dispatch } from "redux";
import axios from "axios";
import {
  QUITAR_BODEGA_EXCLUIDOS_REQUEST,
  QUITAR_BODEGA_EXCLUIDOS_SUCCESS,
  QUITAR_BODEGA_EXCLUIDOS_FAIL,
} from "./../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const quitarBodegaExcluidosActions = (listaQuitar: Record<string, any>[]) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    if (!listaQuitar || Object.keys(listaQuitar).length === 0) {
      // console.error("El objeto datosInventario está vacío.");
      return false;
    }
    const body = JSON.stringify(listaQuitar);

    dispatch({ type: QUITAR_BODEGA_EXCLUIDOS_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/QuitarBodegaExcluido`, body, config);

      if (res.status === 200) {
        dispatch({
          type: QUITAR_BODEGA_EXCLUIDOS_SUCCESS
        });
        return true;
      } else {
        dispatch({
          type: QUITAR_BODEGA_EXCLUIDOS_FAIL,
          error:
            "No se pudo registrar en remates la lista seleccionada. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: QUITAR_BODEGA_EXCLUIDOS_FAIL,
        error: "El token ha expirado.",
      });
      dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: QUITAR_BODEGA_EXCLUIDOS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
