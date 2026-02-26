import { Dispatch } from "redux";
import {
  VISADO_ALTAS_REQUEST,
  VISADO_ALTAS_SUCCESS,
  VISADO_ALTAS_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const registrarDocumentoAltaActions = (documento: any) => async (dispatch: Dispatch): Promise<number | null> => {

  const body = JSON.stringify(documento);

  dispatch({ type: VISADO_ALTAS_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CreaDocumentoAlta`, body);

    if (res.status === 200) {
      if (res.data != -1) {
        dispatch({
          type: VISADO_ALTAS_SUCCESS,
          payload: res.data
        });
        return res.data;
      } else {
        dispatch({
          type: VISADO_ALTAS_FAIL,
          error:
            "Hubo un error en el servidor",
        });
        return null;
      }
    }
    else {
      dispatch({
        type: VISADO_ALTAS_FAIL,
        error:
          "No se pudo enviar la solicitud de visado. Por favor, intente nuevamente.",
      });
      return null;
    }

  } catch (err: any) {
    dispatch({
      type: VISADO_ALTAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return null;
  }
};
