import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTADO_GENERAL_BAJAS_REQUEST,
  LISTADO_GENERAL_BAJAS_SUCCESS,
  LISTADO_GENERAL_BAJAS_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";


export const listaAltasdesdeBajasActions = (fDesde: string, fHasta: string, af_codigo_generico: string, altasCorr: number, establ_corr: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token;

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: LISTADO_GENERAL_BAJAS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeAltas?fDesde=${fDesde}&fHasta=${fHasta}&af_codigo_generico=${af_codigo_generico}&altasCorr=${altasCorr}&establ_corr=${establ_corr}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTADO_GENERAL_BAJAS_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
          dispatch({
            type: LISTADO_GENERAL_BAJAS_FAIL,
            error: "Listado sin información"
          });
          return false;
        }
      } else {
        dispatch({
          type: LISTADO_GENERAL_BAJAS_FAIL,
          error: "No se pudo obtener el listado de altas. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: LISTADO_GENERAL_BAJAS_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: LISTADO_GENERAL_BAJAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};

