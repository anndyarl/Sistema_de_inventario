import { Dispatch } from "redux";
import {
  REGISTRAR_MODALIDAD_REQUEST,
  REGISTRAR_MODALIDAD_SUCCESS,
  REGISTRAR_MODALIDAD_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";


export const registrarModalidadActions = (otra_modalidad: string) => async (dispatch: Dispatch): Promise<number | null> => {

  const body = JSON.stringify(otra_modalidad);

  dispatch({ type: REGISTRAR_MODALIDAD_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearModalidad/`, body);

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
};

