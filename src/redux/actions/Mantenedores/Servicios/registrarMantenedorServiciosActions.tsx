import { Dispatch } from "redux";
import axios from "axios";
import {
  REGISTRAR_SERVICIO_REQUEST,
  REGISTRAR_SERVICIO_SUCCESS,
  REGISTRAR_SERVICIO_FAIL,
} from "../types";

// Acción para obtener la recepción por número
export const registrarMantenedorServiciosActions = (formModal: Record<string, any>) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
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

    dispatch({ type: REGISTRAR_SERVICIO_REQUEST });

    try {
      const res = await axios.post(`http://localhost:5076/api/inventario/CrearServicios`, body, config);

      if (res.status === 200) {
        dispatch({
          type: REGISTRAR_SERVICIO_SUCCESS
        });
        return true;
      } else {
        dispatch({
          type: REGISTRAR_SERVICIO_FAIL,
          error:
            "No se pudo registrar los datos ingresados. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: REGISTRAR_SERVICIO_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
      return false;
    }
  } else {
    dispatch({
      type: REGISTRAR_SERVICIO_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
