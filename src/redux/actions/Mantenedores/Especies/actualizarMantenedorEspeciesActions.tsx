import { Dispatch } from "redux";
import {
  ACTUALIZAR_ESPECIE_REQUEST,
  ACTUALIZAR_ESPECIE_SUCCESS,
  ACTUALIZAR_ESPECIE_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const actualizarMantenedorEspeciesActions = (formModal: Record<string, any>) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!formModal || Object.keys(formModal).length === 0) {
    return false;
  }
  const body = JSON.stringify(formModal);

  dispatch({ type: ACTUALIZAR_ESPECIE_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/ActualizaEspecies/`, body);

    if (res.status === 200) {
      dispatch({
        type: ACTUALIZAR_ESPECIE_SUCCESS
      });
      return true;
    } else {
      dispatch({
        type: ACTUALIZAR_ESPECIE_FAIL,
        error:
          "No se pudo actualizar los datos ingresados. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    console.error("Error en actualizarrMantenedorEspeciesActions:", err);
    dispatch({
      type: ACTUALIZAR_ESPECIE_FAIL,
      error: err?.message || "Error desconocido",
    });
    return false;
  }
};

