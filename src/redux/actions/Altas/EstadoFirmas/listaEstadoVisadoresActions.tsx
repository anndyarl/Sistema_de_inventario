import { Dispatch } from "redux";
import {
  LISTA_ESTADO_VISADORES_REQUEST,
  LISTA_ESTADO_VISADORES_SUCCESS,
  LISTA_ESTADO_VISADORES_FAIL,
} from "../types";
import { ListaEstadoVisadores } from "../../../../components/Altas/EstadoFirmas/EstadoFirmas ";
import axiosInstance from "../../../../services/axiosConfig";

export const listaEstadoVisadoresActions = (idocumento: number) => async (dispatch: Dispatch): Promise<Array<ListaEstadoVisadores> | null> => {

  dispatch({ type: LISTA_ESTADO_VISADORES_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeEstadoVisadores?idocumento=${idocumento}`);
    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_ESTADO_VISADORES_SUCCESS,
          payload: res.data,
        });
        return res.data;
      } else {
        dispatch({
          type: LISTA_ESTADO_VISADORES_FAIL,
          error:
            "Status 200, pero con arreglo de datos vacío",
        });
        return null;
      }
    } else {
      dispatch({
        type: LISTA_ESTADO_VISADORES_FAIL,
        error:
          "No se pudo obtener el listado. Por favor, intente nuevamente.",
      });
      return null;
    }
  } catch (err: any) {
    dispatch({
      type: LISTA_ESTADO_VISADORES_FAIL,
      error: "Error en la solicitud:", err,
    });
    return null;
  }
};

//Excepcion para firms Altas
export const setSeguimientoFirmasActions = (dataSeguimientoEstadoFirma: any) => ({
  type: 'SEGUIMIENTO_FIRMAS_ALTAS',
  payload: dataSeguimientoEstadoFirma,
});
