import { Dispatch } from "redux";
import axios from "axios";
import {
  REGISTRAR_DEPENDENCIA_REQUEST,
  REGISTRAR_DEPENDENCIA_SUCCESS,
  REGISTRAR_DEPENDENCIA_FAIL,
} from "../types";

// Acción para obtener la recepción por número
export const registrarMantenedorDependenciasActions = (fomrModal: Record<string, any>) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    if (!fomrModal || Object.keys(fomrModal).length === 0) {
      // console.error("El objeto datosInventario está vacío.");
      return false;
    }
    const body = JSON.stringify(fomrModal);

    dispatch({ type: REGISTRAR_DEPENDENCIA_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearDependencias`, body, config);

      if (res.status === 200) {
        dispatch({
          type: REGISTRAR_DEPENDENCIA_SUCCESS
        });
        return true;
      } else {
        dispatch({
          type: REGISTRAR_DEPENDENCIA_FAIL,
          error:
            "No se pudo registrar los datos ingresados. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: REGISTRAR_DEPENDENCIA_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
      return false;
    }
  } else {
    dispatch({
      type: REGISTRAR_DEPENDENCIA_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
