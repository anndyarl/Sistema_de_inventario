import axios from 'axios';
import {
  LISTA_CUENTA_FECHAS_REQUEST,
  LISTA_CUENTA_FECHAS_SUCCESS,
  LISTA_CUENTA_FECHAS_FAIL,
} from '../../types';
import { Dispatch } from 'redux';


// Acción para obtener LISTA_CUENTA_FECHAS
export const listaCuentaFechasActions = (fDesde: string, fHasta: string, codCuenta: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    };

    dispatch({ type: LISTA_CUENTA_FECHAS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/ReporteCuentaFechas?fDesde=${fDesde}&fHasta=${fHasta}&codCuenta=${codCuenta}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_CUENTA_FECHAS_SUCCESS,
            payload: res.data
          });
          return true;
        }
        else {
          dispatch({ type: LISTA_CUENTA_FECHAS_FAIL });
          return false;
        }

      } else {
        dispatch({ type: LISTA_CUENTA_FECHAS_FAIL });
      }
      return false;
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: LISTA_CUENTA_FECHAS_FAIL });
      return false;
    }
  } else {
    dispatch({ type: LISTA_CUENTA_FECHAS_FAIL });
    return false;
  }
};
