import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_INVENTARIO_REQUEST,
  LISTA_INVENTARIO_SUCCESS,
  LISTA_INVENTARIO_FAIL,
} from "../types";

export const obtenerListaInventarioActions = (FechaInicio: string, FechaTermino: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
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
      const res = await axios.get(`https://sidra.ssmso.cl/api_erp_inv_qa/api/inventario/traeListaInventario?FechaInicio=${FechaInicio}&FechaTermino=${FechaTermino}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_INVENTARIO_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
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
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: LISTA_INVENTARIO_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_INVENTARIO_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
