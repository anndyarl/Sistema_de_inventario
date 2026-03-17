import { Dispatch } from "redux";
import {
  REGISTRAR_DEPENDENCIA_REQUEST,
  REGISTRAR_DEPENDENCIA_SUCCESS,
  REGISTRAR_DEPENDENCIA_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const registrarMantenedorDependenciasActions = (formModal: Record<string, any>) => async (dispatch: Dispatch): Promise<boolean> => {

  if (!formModal || Object.keys(formModal).length === 0) {
    return false;
  }
  const body = JSON.stringify(formModal);

  dispatch({ type: REGISTRAR_DEPENDENCIA_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearDependencias`, body);

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
  } catch (err: any) {
    dispatch({
      type: REGISTRAR_DEPENDENCIA_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
