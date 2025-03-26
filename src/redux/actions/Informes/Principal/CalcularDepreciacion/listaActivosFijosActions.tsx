import axios from 'axios';
import {
  LISTA_ACTIVOS_FIJOS_INFORME_REQUEST,
  LISTA_ACTIVOS_FIJOS_INFORME_SUCCESS,
  LISTA_ACTIVOS_FIJOS_INFORME_FAIL,
} from '../../types';
import { Dispatch } from 'redux';


// Acción para obtener LISTA_ACTIVOS_FIJOS_INFORME
export const listaActivosFijosActions = (fDesde: string, fHasta: string,) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
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
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeInventario?fDesde=${fDesde}&fHasta=${fHasta}`, config);

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
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: LISTA_ACTIVOS_FIJOS_INFORME_FAIL });
      return false;
    }
  } else {
    dispatch({ type: LISTA_ACTIVOS_FIJOS_INFORME_FAIL });
    return false;
  }
};
