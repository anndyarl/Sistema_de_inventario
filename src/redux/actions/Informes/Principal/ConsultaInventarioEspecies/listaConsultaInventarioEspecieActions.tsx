import axios from 'axios';
import {
  LISTA_CONSULTA_INVENTARIO_ESPECIES_REQUEST,
  LISTA_CONSULTA_INVENTARIO_ESPECIES_SUCCESS,
  LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL,
} from '../../types';
import { Dispatch } from 'redux';
import { LOGOUT } from '../../../auth/types';


// Acción para obtener LISTA_CONSULTA_INVENTARIO_ESPECIES
export const listaConsultaInventarioEspecieActions = (nInventario: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    };

    dispatch({ type: LISTA_CONSULTA_INVENTARIO_ESPECIES_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/ReporteConsultaInventarioEspecie?nInventario=${nInventario}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_CONSULTA_INVENTARIO_ESPECIES_SUCCESS,
            payload: res.data
          });
          return true;
        }
        else {
          dispatch({ type: LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL });
          return false;
        }

      } else {
        dispatch({ type: LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL });
      }
      return false;
    } catch (err: any) {
      dispatch({
        type: LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL,
        error: "El token ha expirado.",
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
