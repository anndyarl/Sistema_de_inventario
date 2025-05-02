import axios from 'axios';
import {
  LISTA_ACTIVOS_CALCULADOS_REQUEST,
  LISTA_ACTIVOS_NO_CALCULADOS_REQUEST,
  LISTA_ACTIVOS_CALCULADOS_SUCCESS,
  LISTA_ACTIVOS_NO_CALCULADOS_SUCCESS,
  LISTA_ACTIVOS_CALCULADOS_FAIL,
  LISTA_ACTIVOS_NO_CALCULADOS_FAIL
} from '../../types';
import { Dispatch } from 'redux';
import { LOGOUT } from '../../../auth/types';


// Acción para obtener LISTA_ACTIVOS_CALCULADOS
export const listaActivosCalculadosActions = (activosSeleccionados: Record<string, any>[]) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
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
    dispatch({ type: LISTA_ACTIVOS_CALCULADOS_REQUEST });
    dispatch({ type: LISTA_ACTIVOS_NO_CALCULADOS_REQUEST });

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CalculoDeInventario`, body, config);

      if (res.status === 200) {
        if (res.data?.depreciaciones?.length > 0) {
          dispatch({
            type: LISTA_ACTIVOS_CALCULADOS_SUCCESS,
            payload: res.data.depreciaciones
          });
        }
        if (res.data?.vidaUtilCero?.length > 0) {
          dispatch({
            type: LISTA_ACTIVOS_NO_CALCULADOS_SUCCESS,
            payload: res.data.vidaUtilCero
          });
        }
        else {
          dispatch({
            type: LISTA_ACTIVOS_NO_CALCULADOS_SUCCESS,
            payload: []
          });
        }
        return true;
      } else {
        dispatch({ type: LISTA_ACTIVOS_CALCULADOS_FAIL });
        dispatch({ type: LISTA_ACTIVOS_NO_CALCULADOS_FAIL });
        return false;
      }
    } catch (err: any) {
      dispatch({
        type: LISTA_ACTIVOS_CALCULADOS_FAIL,
        error: "El token ha expirado.",
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  }
  else {
    dispatch({
      type: LISTA_ACTIVOS_CALCULADOS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });

    dispatch({ type: LOGOUT });
    return false;
  }
}

