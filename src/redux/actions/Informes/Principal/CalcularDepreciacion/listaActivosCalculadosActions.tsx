import {
  //Calculados
  LISTA_ACTIVOS_CALCULADOS_REQUEST,
  LISTA_ACTIVOS_CALCULADOS_SUCCESS,
  LISTA_ACTIVOS_CALCULADOS_FAIL,
  //No Calculados
  LISTA_ACTIVOS_NO_CALCULADOS_REQUEST,
  LISTA_ACTIVOS_NO_CALCULADOS_SUCCESS,
  LISTA_ACTIVOS_NO_CALCULADOS_FAIL

} from '../../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../../services/axiosConfig';

export const listaActivosCalculadosActions = (activosSeleccionados: Record<string, any>[]) => async (dispatch: Dispatch): Promise<{ success: boolean; error?: string }> => {

  if (!activosSeleccionados || Object.keys(activosSeleccionados).length === 0) {
    return { success: false, error: "No hay activos seleccionados para calcular la depreciación." };
  }
  const body = JSON.stringify(activosSeleccionados);
  dispatch({ type: LISTA_ACTIVOS_CALCULADOS_REQUEST });
  dispatch({ type: LISTA_ACTIVOS_NO_CALCULADOS_REQUEST });

  try {
    const res = await axiosInstance.post(`${import.meta.env.VITE_CSRF_API_URL}/CalculoDeInventario`, body);

    if (res.status === 200) {
      dispatch({
        type: LISTA_ACTIVOS_CALCULADOS_SUCCESS,
        payload: res.data.depreciaciones
      });

      if (res.data?.vidaUtilCero?.length > 0) {
        dispatch({
          type: LISTA_ACTIVOS_NO_CALCULADOS_SUCCESS,
          payload: res.data.vidaUtilCero
        });
      } else {
        dispatch({
          type: LISTA_ACTIVOS_NO_CALCULADOS_SUCCESS,
          payload: []
        });
      }
      return { success: true };

    } else {
      dispatch({ type: LISTA_ACTIVOS_CALCULADOS_FAIL });
      dispatch({ type: LISTA_ACTIVOS_NO_CALCULADOS_FAIL });
      return { success: false, error: "Error al calcular la depreciación." };
    }
  } catch (err: any) {
    dispatch({
      type: LISTA_ACTIVOS_CALCULADOS_FAIL,
      error: "Error en la solicitud:", err,
      payload: err.response ? err.response.data : "Error de red o del servidor"
    });
    return { success: false, error: err.response?.data.mensaje && err.response?.data.detalle || "Error desconocido en el servidor." };
  }
}

