import axios from 'axios';
import {
  LISTA_ACTIVOS_FIJOS_INFORME_REQUEST,
  LISTA_ACTIVOS_FIJOS_INFORME_SUCCESS,
  LISTA_ACTIVOS_FIJOS_INFORME_FAIL,
} from '../../types';
import { Dispatch } from 'redux';
import { LOGOUT } from '../../../auth/types';

export const listaActivosFijosActions = (cta_cod: string, fDesde: string, fHasta: string, af_codigo_generico: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    };

    dispatch({ type: LISTA_ACTIVOS_FIJOS_INFORME_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeInventario?cta_cod=${cta_cod}&fDesde=${fDesde}&fHasta=${fHasta}&af_codigo_generico=${af_codigo_generico}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_ACTIVOS_FIJOS_INFORME_SUCCESS,
            payload: res.data
          });
          return true;
        }
        else {
          dispatch({ type: LISTA_ACTIVOS_FIJOS_INFORME_FAIL });
          return false;
        }
      } else {
        dispatch({ type: LISTA_ACTIVOS_FIJOS_INFORME_FAIL });
      }
      return false;
    } catch (err: any) {
      dispatch({
        type: LISTA_ACTIVOS_FIJOS_INFORME_FAIL,
        error: "Error en la solicitud:", err,
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_ACTIVOS_FIJOS_INFORME_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
