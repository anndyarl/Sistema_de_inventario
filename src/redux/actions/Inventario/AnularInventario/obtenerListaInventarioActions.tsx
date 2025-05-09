import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_INVENTARIO_REQUEST,
  LISTA_INVENTARIO_SUCCESS,
  LISTA_INVENTARIO_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

export const obtenerListaInventarioActions = (af_codigo_generico: string, FechaInicio: string, FechaTermino: string, estabL_CORR: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: LISTA_INVENTARIO_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/traeListaInventario?af_codigo_generico=${af_codigo_generico}&FechaInicio=${FechaInicio}&FechaTermino=${FechaTermino}&estabL_CORR=${estabL_CORR}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_INVENTARIO_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
          dispatch({
            type: LISTA_INVENTARIO_FAIL,
            error: "No se pudo obtener los datos. Por favor, intente nuevamente.",
          });
          return false;
        }
      } else {
        dispatch({
          type: LISTA_INVENTARIO_FAIL,
          error:
            "No se pudo obtener el listado de altas. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: LISTA_INVENTARIO_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_INVENTARIO_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
