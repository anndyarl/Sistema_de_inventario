import { Dispatch } from "redux";
import axios from "axios";
import {
  RECHAZAR_ALTA_REQUEST,
  RECHAZAR_ALTA_SUCCESS,
  RECHAZAR_ALTA_FAIL,
} from "../types";

// Acción para obtener la recepción por número
export const rechazarAltaActions = (documento: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(documento);

    dispatch({ type: RECHAZAR_ALTA_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/RechazarAlta`, body, config);
      // console.log("Se ha registrado", res);
      if (res.status === 200) {
        dispatch({
          type: RECHAZAR_ALTA_SUCCESS,
          payload: res.data
        });
        return true;
      } else {
        dispatch({
          type: RECHAZAR_ALTA_FAIL,
          error:
            "No se pudo rechazar la alta seleccionada. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: RECHAZAR_ALTA_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: RECHAZAR_ALTA_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
