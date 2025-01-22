import { Dispatch } from "redux";
import axios from "axios";
import {
  REGISTRAR_REMATES_REQUEST,
  REGISTRAR_REMATES_SUCCESS,
  REGISTRAR_REMATES_FAIL,
} from "./types";

// Acción para obtener la recepción por número
export const rematarBajasActions = (listaRemates: Record<string, any>[]) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    if (!listaRemates || Object.keys(listaRemates).length === 0) {
      // console.error("El objeto datosInventario está vacío.");
      return false;
    }
    const body = JSON.stringify(listaRemates);

    dispatch({ type: REGISTRAR_REMATES_REQUEST });

    try {
      const res = await axios.post(`https://sidra.ssmso.cl/api_erp_inv_qa/api/inventario/CreaRemates`, body, config);

      if (res.status === 200) {
        dispatch({
          type: REGISTRAR_REMATES_SUCCESS
        });
        return true;
      } else {
        dispatch({
          type: REGISTRAR_REMATES_FAIL,
          error:
            "No se pudo registrar en remates la lista seleccionada. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: REGISTRAR_REMATES_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
      return false;
    }
  } else {
    dispatch({
      type: REGISTRAR_REMATES_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
