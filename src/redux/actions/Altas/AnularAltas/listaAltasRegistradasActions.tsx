import { Dispatch } from "redux";
import axios from "axios";
import {
  OBTENER_ALTAS_REGISTRADAS_REQUEST,
  OBTENER_ALTAS_REGISTRADAS_SUCCESS,
  OBTENER_ALTAS_REGISTRADAS_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

export const listaAltasRegistradasActions = (fDesde: string, fHasta: string, establ_corr: number, altasCorr: number, af_codigo_generico: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: OBTENER_ALTAS_REGISTRADAS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeAltas?fDesde=${fDesde}&fHasta=${fHasta}&establ_corr=${establ_corr}&altasCorr=${altasCorr}&af_codigo_generico=${af_codigo_generico}`, config);
      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: OBTENER_ALTAS_REGISTRADAS_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
          dispatch({
            type: OBTENER_ALTAS_REGISTRADAS_FAIL,
            error:
              "Status 200, pero con arreglo de datos vacío",
          });
          return false;
        }
      } else {
        dispatch({
          type: OBTENER_ALTAS_REGISTRADAS_FAIL,
          error:
            "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: OBTENER_ALTAS_REGISTRADAS_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: OBTENER_ALTAS_REGISTRADAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
