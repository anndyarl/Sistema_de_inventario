import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_TRASPASOS_REQUEST,
  LISTA_TRASPASOS_SUCCESS,
  LISTA_TRASPASOS_FAIL,
} from "./types";
import { LOGOUT } from "../auth/types";

// Acción para obtener la recepción por número
export const listadoTraspasosEnviadosActions = (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number, usuario_crea: number, pas_estado_recibe: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: LISTA_TRASPASOS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeListaDeTraspasosEnviados?fDesde=${fDesde}&fHasta=${fHasta}&af_codigo_generico=${af_codigo_generico}&tras_corr=${tras_corr}&establ_corr=${establ_corr}&usuario_crea=${usuario_crea}&pas_estado_recibe=${pas_estado_recibe}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_TRASPASOS_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
          dispatch({
            type: LISTA_TRASPASOS_FAIL,
            error:
              "Status 200, pero con arreglo de datos vacío",
          });
          return false;
        }
      } else {
        dispatch({
          type: LISTA_TRASPASOS_SUCCESS,
          error:
            "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: LISTA_TRASPASOS_SUCCESS,
        // error: "El token ha expirado.",
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_TRASPASOS_SUCCESS,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
