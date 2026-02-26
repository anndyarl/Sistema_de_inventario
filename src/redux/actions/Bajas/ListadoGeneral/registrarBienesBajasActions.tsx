import { Dispatch } from "redux";
import {
  REGISTRAR_BIENES_BAJAS_REQUEST,
  REGISTRAR_BIENES_BAJAS_SUCCESS,
  REGISTRAR_BIENES_BAJAS_FAIL,
} from "./../types";
import axiosInstance from "../../../../services/axiosConfig";

export const registrarBienesBajasActions = (activos: { aF_CLAVE: number, usuariO_MOD: string, ctA_COD: string, esP_NOMBRE: string, establ_corr: number }[]) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {

  const body = JSON.stringify(activos);
  dispatch({ type: REGISTRAR_BIENES_BAJAS_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearBienesBajas`, body);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: REGISTRAR_BIENES_BAJAS_SUCCESS,
          payload: res.data
        });
        return true;
      } else {
        dispatch({
          type: REGISTRAR_BIENES_BAJAS_FAIL,
          error:
            "No se pudo registrar la baja seleccionada. Por favor, intente nuevamente.",
        });
        return false;
      }
    }
    else {
      dispatch({
        type: REGISTRAR_BIENES_BAJAS_FAIL,
        error:
          "No se pudo registrar la baja seleccionada. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: REGISTRAR_BIENES_BAJAS_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
