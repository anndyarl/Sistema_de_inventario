import { Dispatch } from "redux";
import axios from "axios";
import {
  REGISTRAR_BAJAS_REQUEST,
  REGISTRAR_BAJAS_SUCCESS,
  REGISTRAR_BAJAS_FAIL,
} from "./types";

// Acción para obtener la recepción por número
export const registrarBajasActions = (activos: { aF_CLAVE: number }[]) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(activos);
    dispatch({ type: REGISTRAR_BAJAS_REQUEST });

    try {
      const res = await axios.post("/api_inv/api/inventario/CrearBajasManual", body, config);

      if (res.status === 200) {
        dispatch({
          type: REGISTRAR_BAJAS_SUCCESS
        });
        return true;
      } else {
        dispatch({
          type: REGISTRAR_BAJAS_FAIL,
          error:
            "No se pudo registrar la baja seleccionada. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: REGISTRAR_BAJAS_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
      return false;
    }
  } else {
    dispatch({
      type: REGISTRAR_BAJAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
