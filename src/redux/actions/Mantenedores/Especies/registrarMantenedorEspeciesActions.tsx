import { Dispatch } from "redux";
import {
  REGISTRAR_ESPECIE_REQUEST,
  REGISTRAR_ESPECIE_SUCCESS,
  REGISTRAR_ESPECIE_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

// Acción para obtener la recepción por número
export const registrarMantenedorEspeciesActions = (formModal: Record<string, any>) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!formModal || Object.keys(formModal).length === 0) {
    // console.error("El objeto datosInventario está vacío.");
    return false;
  }
  const body = JSON.stringify(formModal);

  dispatch({ type: REGISTRAR_ESPECIE_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearEspecies/`, body);

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
};

