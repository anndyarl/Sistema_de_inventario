import { Dispatch } from "redux";
import {
  ACTUALIZAR_PROVEEDOR_REQUEST,
  ACTUALIZAR_PROVEEDOR_SUCCESS,
  ACTUALIZAR_PROVEEDOR_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const actualizarMantenedorProveedoresActions = (formModal: Record<string, any>) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!formModal || Object.keys(formModal).length === 0) {
    return false;
  }
  const body = JSON.stringify(formModal);

  dispatch({ type: ACTUALIZAR_PROVEEDOR_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/ActualizaProveedores/`, body);

    if (res.status === 200) {
      dispatch({
        type: ACTUALIZAR_PROVEEDOR_SUCCESS
      });
      return true;
    } else {
      dispatch({
        type: ACTUALIZAR_PROVEEDOR_FAIL,
        error:
          "No se pudo actualizar los datos ingresados. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    console.error("Error en actualizarrMantenedorEspeciesActions:", err);
    dispatch({
      type: ACTUALIZAR_PROVEEDOR_FAIL,
      error: err?.message || "Error desconocido",
    });
    return false;
  }
};

