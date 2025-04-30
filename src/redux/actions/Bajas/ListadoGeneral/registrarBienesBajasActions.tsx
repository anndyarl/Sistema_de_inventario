import { Dispatch } from "redux";
import axios from "axios";
import {
  REGISTRAR_BIENES_BAJAS_REQUEST,
  REGISTRAR_BIENES_BAJAS_SUCCESS,
  REGISTRAR_BIENES_BAJAS_FAIL,
} from "./../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const registrarBienesBajasActions = (activos: { aF_CLAVE: number, usuariO_MOD: string, bajaS_CORR: number, especie: string, ctA_COD: string }[]) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(activos);
    dispatch({ type: REGISTRAR_BIENES_BAJAS_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearBienesBajas`, body, config);

      if (res.status === 200) {
        dispatch({
          type: REGISTRAR_BIENES_BAJAS_SUCCESS
        });
        return true;
      } else {
        dispatch({
          type: REGISTRAR_BIENES_BAJAS_FAIL,
          error:
            "No se pudo registrar la baja seleccionada. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: REGISTRAR_BIENES_BAJAS_FAIL,
        error: "El token ha expirado.",
      });
      dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: REGISTRAR_BIENES_BAJAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
