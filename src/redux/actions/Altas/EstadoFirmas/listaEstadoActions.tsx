import { Dispatch } from "redux";
import {
  LISTA_ESTADO_REQUEST,
  LISTA_ESTADO_SUCCESS,
  LISTA_ESTADO_FAIL,
} from "../types";
import axiosInstance from "../../../../services/axiosConfig";

export const listaEstadoActions =
  (
    altas_corr: number,
    idDocumento: number,
    establ_corr: number,
    onSuccess?: (data: any[]) => void
  ) =>
    async (dispatch: Dispatch): Promise<boolean> => {

      dispatch({ type: LISTA_ESTADO_REQUEST });

      try {
        const res = await axiosInstance.get(`/TraeFirmaAltas?altas_corr=${altas_corr}&idDocumento=${idDocumento}&establ_corr=${establ_corr}`);

        if (res.status === 200) {
          dispatch({
            type: LISTA_ESTADO_SUCCESS,
            payload: res.data,
          });

          if (onSuccess) {
            onSuccess(res.data);
          }

          return true;
        } else {
          dispatch({
            type: LISTA_ESTADO_FAIL,
            error: "Respuesta sin datos",
          });
          return false;
        }
      } catch (error) {
        dispatch({
          type: LISTA_ESTADO_FAIL,
          error: "Error en la solicitud",
        });
        return false;
      }
    };