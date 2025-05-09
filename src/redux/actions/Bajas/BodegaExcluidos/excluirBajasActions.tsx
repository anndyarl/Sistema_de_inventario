import { Dispatch } from "redux";
import axios from "axios";
import {
  REGISTRAR_EXCLUIDOS_REQUEST,
  REGISTRAR_EXCLUIDOS_SUCCESS,
  REGISTRAR_EXCLUIDOS_FAIL,
} from "./../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const excluirBajasActions = (listaExcluir: Record<string, any>[]) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    if (!listaExcluir || Object.keys(listaExcluir).length === 0) {
      // console.error("El objeto datosInventario está vacío.");
      return false;
    }
    const body = JSON.stringify(listaExcluir);

    dispatch({ type: REGISTRAR_EXCLUIDOS_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CreaBodegaExcluido`, body, config);

      if (res.status === 200) {
        dispatch({
          type: REGISTRAR_EXCLUIDOS_SUCCESS
        });
        return true;
      } else {
        dispatch({
          type: REGISTRAR_EXCLUIDOS_FAIL,
          error:
            "No se pudo registrar en remates la lista seleccionada. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: REGISTRAR_EXCLUIDOS_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: REGISTRAR_EXCLUIDOS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
