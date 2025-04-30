import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_TRASLADOS_REQUEST,
  LISTA_TRASLADOS_SUCCESS,
  LISTA_TRASLADOS_FAIL,
} from "./types";

// Acción para obtener la recepción por número
export const listadoTrasladosActions = (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
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
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeListaDeTraslados?fDesde=${fDesde}&fHasta=${fHasta}&af_codigo_generico=${af_codigo_generico}&tras_corr=${tras_corr}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_TRASLADOS_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
          dispatch({
            type: LISTA_TRASLADOS_FAIL,
            error:
              "Status 200, pero con arreglo de datos vacío",
          });
          return false;
        }
      } else {
        dispatch({
          type: LISTA_TRASLADOS_SUCCESS,
          error:
            "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {
      // console.error("Error en la solicitud:", err);
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
