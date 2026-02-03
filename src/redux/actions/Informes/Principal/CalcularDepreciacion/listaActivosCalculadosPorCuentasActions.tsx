import axios from 'axios';
import {
  //Calculados
  LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_REQUEST,
  LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_SUCCESS,
  LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_FAIL,
  //No Calculados
  LISTA_ACTIVOS_NO_CALCULADOS_POR_CUENTAS_REQUEST,
  LISTA_ACTIVOS_NO_CALCULADOS_POR_CUENTAS_SUCCESS,
  LISTA_ACTIVOS_NO_CALCULADOS_POR_CUENTAS_FAIL

} from '../../types';
import { Dispatch } from 'redux';

// Acción para obtener LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS
export const listaActivosCalculadosPorCuentasActions = (activosSeleccionados: Record<string, any>[]) => async (dispatch: Dispatch, getState: any): Promise<{ success: boolean; error?: string }> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    if (!activosSeleccionados || Object.keys(activosSeleccionados).length === 0) {
      // console.error("El objeto datosInventario está vacío.");
      return { success: false, error: "No hay activos seleccionados para calcular." };
    }
    const body = JSON.stringify(activosSeleccionados);
    dispatch({ type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_REQUEST });
    dispatch({ type: LISTA_ACTIVOS_NO_CALCULADOS_POR_CUENTAS_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CalculoDeCuentas`, body, config);

      if (res.status === 200) {
        dispatch({
          type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_SUCCESS,
          payload: res.data?.resumenPorCuenta ?? []
        });

        if (res.data?.vidaUtilCero?.length > 0) {
          dispatch({
            type: LISTA_ACTIVOS_NO_CALCULADOS_POR_CUENTAS_SUCCESS,
            payload: res.data.vidaUtilCero
          });
        } else {
          dispatch({
            type: LISTA_ACTIVOS_NO_CALCULADOS_POR_CUENTAS_SUCCESS,
            payload: []
          });
        }
        return { success: true };

      } else {
        dispatch({ type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_FAIL });
        dispatch({ type: LISTA_ACTIVOS_NO_CALCULADOS_POR_CUENTAS_FAIL });
        return { success: false, error: "Error al calcular la depreciación." };
      }
    } catch (err: any) {
      dispatch({
        type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return { success: false, error: err.response?.data.mensaje && err.response?.data.detalle || "Error desconocido en el servidor." };
    }
  }
  else {
    dispatch({
      type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return { success: false, error: "No se encontró un token de autenticación válido." };
  }
}

