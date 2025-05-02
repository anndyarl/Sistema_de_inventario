import { Dispatch } from "redux";
import axios from "axios";
import {
  OBTENER_INVENTARIO_REQUEST,
  OBTENER_INVENTARIO_SUCCESS,
  OBTENER_INVENTARIO_FAIL
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por af_clave
export const obtenerInventarioActions = (af_codigo_generico: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token;
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: OBTENER_INVENTARIO_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeInvxID?af_codigo_generico=${af_codigo_generico}`, config);

      if (res.status === 200) {
        const isEmpty = res.data && Object.values(res.data).every((value) => value === 0 || value === null || value === undefined);
        if (!isEmpty) {
          dispatch({
            type: OBTENER_INVENTARIO_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
          dispatch({
            type: OBTENER_INVENTARIO_FAIL,
            error: "No se pudo obtener los datos. Por favor, intente nuevamente.",
          });
          return false;
        }
      } else {
        dispatch({
          type: OBTENER_INVENTARIO_FAIL,
          error:
            "No se pudo obtener el inventario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: OBTENER_INVENTARIO_FAIL,
        error: "El token ha expirado.",
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: OBTENER_INVENTARIO_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
