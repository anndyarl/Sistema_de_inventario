import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_ESTADO_VISADORES_REQUEST,
  LISTA_ESTADO_VISADORES_SUCCESS,
  LISTA_ESTADO_VISADORES_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const listaEstadoVisadoresActions = (altas_corr: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: LISTA_ESTADO_VISADORES_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeEstadoVisadores?altas_corr=${altas_corr}`, config);
      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_ESTADO_VISADORES_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
          dispatch({
            type: LISTA_ESTADO_VISADORES_FAIL,
            error:
              "Status 200, pero con arreglo de datos vacío",
          });
          return false;
        }
      } else {
        dispatch({
          type: LISTA_ESTADO_VISADORES_FAIL,
          error:
            "No se pudo obtener el listado. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: LISTA_ESTADO_VISADORES_FAIL,
        error: "Error en la solicitud:", err,
      });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_ESTADO_VISADORES_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};