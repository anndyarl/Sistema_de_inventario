import { Dispatch } from "redux";
import axios from "axios";
import {
  ANULAR_INVENTARIO_REQUEST,
  ANULAR_INVENTARIO_SUCCESS,
  ANULAR_INVENTARIO_FAIL,
} from "../types";

// Acción para obtener la recepción por número
export const anularInventarioActions = (AF_CLAVE: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: ANULAR_INVENTARIO_REQUEST });

    try {
      const res = await axios.get(`https://sidra.ssmso.cl/api_erp_inv_qa/api/inventario/AnulaInventario?AF_CLAVE=${AF_CLAVE}`, config);

      if (res.status === 200) {
        dispatch({
          type: ANULAR_INVENTARIO_SUCCESS,
          payload: res.data,
        });
        return true;
      } else {
        dispatch({
          type: ANULAR_INVENTARIO_FAIL,
          error:
            "No se pudo obtener el inventario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: ANULAR_INVENTARIO_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
      return false;
    }
  } else {
    dispatch({
      type: ANULAR_INVENTARIO_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
