import { Dispatch } from "redux";
import axios from "axios";
import {
  ETIQUETAS_ALTAS_REQUEST,
  ETIQUETAS_ALTAS_SUCCESS,
  ETIQUETAS_ALTAS_FAIL,
} from "../types";

// Acción para obtener la recepción por número
export const obtenerEtiquetasAltasActions = (af_clave: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: ETIQUETAS_ALTAS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/DatosEtiquetas?af_clave=${af_clave}`, config);
      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: ETIQUETAS_ALTAS_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
          dispatch({
            type: ETIQUETAS_ALTAS_FAIL,
            error:
              "No se pudo obtener los datos solicitados. Por favor, intente nuevamente.",
          });
          return false;
        }
      } else {
        dispatch({
          type: ETIQUETAS_ALTAS_FAIL,
          error:
            "No se pudo obtener los datos solicitados. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {

      dispatch({
        type: ETIQUETAS_ALTAS_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
      return false;
    }
  } else {
    dispatch({
      type: ETIQUETAS_ALTAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
