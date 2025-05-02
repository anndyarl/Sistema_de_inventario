import axios from 'axios';
import {
  LISTA_SERVICIO_DEPENDENCIA_REQUEST,
  LISTA_SERVICIO_DEPENDENCIA_SUCCESS,
  LISTA_SERVICIO_DEPENDENCIA_FAIL,
} from '../../types';
import { Dispatch } from 'redux';
import { LOGOUT } from '../../../auth/types';


// Acción para obtener LISTA_SERVICIO_DEPENDENCIA
export const listaFolioServicioDependenciaActions = (dep_corr: number, establ_corr: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    };

    dispatch({ type: LISTA_SERVICIO_DEPENDENCIA_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/ReporteFoliosPorServicioDependencia?dep_corr=${dep_corr}&establ_corr=${establ_corr}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_SERVICIO_DEPENDENCIA_SUCCESS,
            payload: res.data
          });
          return true;
        }
        else {
          dispatch({ type: LISTA_SERVICIO_DEPENDENCIA_FAIL });
          return false;
        }

      } else {
        dispatch({ type: LISTA_SERVICIO_DEPENDENCIA_FAIL });
      }
      return false;
    } catch (err: any) {
      dispatch({
        type: LISTA_SERVICIO_DEPENDENCIA_FAIL,
        error: "El token ha expirado.",
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_SERVICIO_DEPENDENCIA_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
