import { Dispatch } from "redux";
import axios from "axios";
import {
  REGISTRAR_PROVEEDORES_REQUEST,
  REGISTRAR_PROVEEDORES_SUCCESS,
  REGISTRAR_PROVEEDORES_FAIL,
} from "../types";

export const registrarMantenedorProveedoresActions = (formModal: Record<string, any>) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!formModal || Object.keys(formModal).length === 0) {
    return false;
  }
  const body = JSON.stringify(formModal);

  dispatch({ type: REGISTRAR_PROVEEDORES_REQUEST });

  try {
    const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearProveedores`, body);

    if (res.status === 200) {
      dispatch({
        type: REGISTRAR_PROVEEDORES_SUCCESS
      });
      return true;
    } else {
      dispatch({
        type: REGISTRAR_PROVEEDORES_FAIL,
        error:
          "No se pudo registrar los datos ingresados. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: REGISTRAR_PROVEEDORES_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};