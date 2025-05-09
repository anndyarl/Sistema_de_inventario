import { Dispatch } from "redux";
import axios from "axios";
import {
  POST_FORMULARIO_REQUEST,
  POST_FORMULARIO_SUCCESS,
  POST_FORMULARIO_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

export const modificarFormInventarioActions = (ActivoFijoCompleto: Record<string, any>) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; // Token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    if (!ActivoFijoCompleto || Object.keys(ActivoFijoCompleto).length === 0) {
      // console.error("El objeto datosInventario está vacío.");
      return false;
    }
    const body = JSON.stringify(ActivoFijoCompleto);

    dispatch({ type: POST_FORMULARIO_REQUEST });

    try {
      const response = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/actualizaActivoFijo/`, body, config);

      if (response.status === 200) {
        if (response.data === 1) {
          dispatch({
            type: POST_FORMULARIO_SUCCESS,
            payload: response.data,
          });
          return true;
        }
        else {
          dispatch({
            type: POST_FORMULARIO_SUCCESS,
            payload: response.data,
          });
          return false;
        }

      } else {
        dispatch({
          type: POST_FORMULARIO_FAIL,
          error: "No se pudo obtener el inventario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: POST_FORMULARIO_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: POST_FORMULARIO_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
