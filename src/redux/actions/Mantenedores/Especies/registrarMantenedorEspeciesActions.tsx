import { Dispatch } from "redux";
import axios from "axios";
import {
  REGISTRAR_ESPECIE_REQUEST,
  REGISTRAR_ESPECIE_SUCCESS,
  REGISTRAR_ESPECIE_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

// Acción para obtener la recepción por número
export const registrarMantenedorEspeciesActions = (formModal: Record<string, any>) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    if (!formModal || Object.keys(formModal).length === 0) {
      // console.error("El objeto datosInventario está vacío.");
      return false;
    }
    const body = JSON.stringify(formModal);

    dispatch({ type: REGISTRAR_ESPECIE_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearEspecies`, body, config);

      if (res.status === 200) {
        dispatch({
          type: REGISTRAR_ESPECIE_SUCCESS
        });
        return true;
      } else {
        dispatch({
          type: REGISTRAR_ESPECIE_FAIL,
          error:
            "No se pudo registrar los datos ingresados. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err: any) {
      console.error("Error en registrarMantenedorEspeciesActions:", err);
      dispatch({
        type: REGISTRAR_ESPECIE_FAIL,
        error: err?.message || "Error desconocido",
      });
      return false;
    }
  } else {
    dispatch({
      type: REGISTRAR_ESPECIE_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};

