import { Dispatch } from "redux";
import axios from "axios";
import {
  REGISTRAR_MODALIDAD_REQUEST,
  REGISTRAR_MODALIDAD_SUCCESS,
  REGISTRAR_MODALIDAD_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const registrarModalidadActions = (otra_modalidad: string) => async (dispatch: Dispatch, getState: any): Promise<number | null> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(otra_modalidad);

    dispatch({ type: REGISTRAR_MODALIDAD_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearModalidad/`, body, config);

      if (res.status === 200) {
        dispatch({
          type: REGISTRAR_MODALIDAD_SUCCESS
        });
        return res.data;
      } else {
        dispatch({
          type: REGISTRAR_MODALIDAD_FAIL,
          error:
            "No se pudo registrar los datos ingresados. Por favor, intente nuevamente.",
        });
        return null;
      }
    } catch (err: any) {
      dispatch({
        type: REGISTRAR_MODALIDAD_FAIL,
        error: err?.message || "Error desconocido",
      });
      return null;
    }
  } else {
    dispatch({
      type: REGISTRAR_MODALIDAD_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return null;
  }
};

