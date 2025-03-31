import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_TRASLADOS_REQUEST,
  LISTA_TRASLADOS_SUCCESS,
  LISTA_TRASLADOS_FAIL,
} from "./types";

// Acción para obtener la recepción por número
export const listadoTrasladosActions = (tras_corr: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: LISTA_TRASLADOS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeListaDeTraslados?tras_corr=${tras_corr}`, config);

      if (res.status === 200) {
        dispatch({
          type: LISTA_TRASLADOS_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: LISTA_TRASLADOS_FAIL,
          error:
            "No se pudo obtener el inventario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: LISTA_TRASLADOS_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_TRASLADOS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
