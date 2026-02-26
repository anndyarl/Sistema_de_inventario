import { Dispatch } from "redux";
import {
  REGISTRAR_BIENES_BAJAS_REQUEST,
  REGISTRAR_BIENES_BAJAS_SUCCESS,
  REGISTRAR_BIENES_BAJAS_FAIL,
} from "./types";
import axiosInstance from "../../../services/axiosConfig";

export const registrarBienesBajasActions = (activos: { aF_CLAVE: number, usuariO_MOD: string, bajaS_CORR: number, especie: string, ctA_COD: string }[]) => async (dispatch: Dispatch): Promise<boolean> => {

  const body = JSON.stringify(activos);
  dispatch({ type: REGISTRAR_BIENES_BAJAS_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CrearBienesBajas`, body);

    if (res.status === 200) {
      dispatch({
        type: REGISTRAR_BIENES_BAJAS_SUCCESS
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
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: REGISTRAR_BIENES_BAJAS_FAIL,
      error: "Error en la solicitud. Por favor, intente nuevamente.",
    });
    return false;
  }
};
