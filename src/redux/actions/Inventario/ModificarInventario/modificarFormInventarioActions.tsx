import { Dispatch } from "redux";
import {
  ACTUALIZAR_FORMULARIO_REQUEST,
  ACTUALIZAR_FORMULARIO_SUCCESS,
  ACTUALIZAR_FORMULARIO_FAIL,
} from "../types";
import { InventarioCompleto } from "../../../../components/Inventario/ModificarInventario";
import axiosInstance from "../../../../services/axiosConfig";

export const modificarFormInventarioActions = (activos: InventarioCompleto[]) => async (dispatch: Dispatch): Promise<{ success: boolean; error?: string }> => {

  if (!activos?.length) {
    const error = "No se proporcionaron activos para actualizar.";
    dispatch({ type: ACTUALIZAR_FORMULARIO_FAIL, error });
    return { success: false, error };
  }

  dispatch({ type: ACTUALIZAR_FORMULARIO_REQUEST });

  try {
    const { data, status } = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/actualizaActivoFijo/`, activos);

    if (status === 200) {
      const success = data === '1';
      if (success) {
        dispatch({ type: ACTUALIZAR_FORMULARIO_SUCCESS, payload: data });
        return { success };
      } else {
        const error = `Servidor retornó: ${data}`;
        dispatch({ type: ACTUALIZAR_FORMULARIO_FAIL, error });
        return { success: false, error };
      }
    }

    const error = "No se pudo actualizar el inventario. Intente nuevamente.";
    dispatch({ type: ACTUALIZAR_FORMULARIO_FAIL, error });
    return { success: false, error };

  } catch (err: any) {
    const serverError = err.response?.data?.message
      || err.response?.data?.error
      || err.message
      || "Error desconocido en el servidor.";

    dispatch({ type: ACTUALIZAR_FORMULARIO_FAIL, error: serverError });
    return { success: false, error: serverError };
  }
};

