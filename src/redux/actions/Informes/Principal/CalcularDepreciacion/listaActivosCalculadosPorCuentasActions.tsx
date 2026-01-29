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
export const listaActivosCalculadosPorCuentasActions = (activosSeleccionados: Record<string, any>[]) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
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
      return false;
    }
    const body = JSON.stringify(activosSeleccionados);
    dispatch({ type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_REQUEST });
    dispatch({ type: LISTA_ACTIVOS_NO_CALCULADOS_POR_CUENTAS_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CalculoDeCuentas`, body, config);

      if (res.status === 200) {
        if (res.data?.resumenPorCuenta?.length > 0) {
          dispatch({
            type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_SUCCESS,
            payload: res.data?.resumenPorCuenta ?? []
          });
        } else {
          dispatch({
            type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_SUCCESS,
            payload: []
          });
        }

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
        return true;

      } else {
        dispatch({ type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_FAIL });
        dispatch({ type: LISTA_ACTIVOS_NO_CALCULADOS_POR_CUENTAS_FAIL });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  }
  else {
    dispatch({
      type: LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
}

