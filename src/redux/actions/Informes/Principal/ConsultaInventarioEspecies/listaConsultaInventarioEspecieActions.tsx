import {
  LISTA_CONSULTA_INVENTARIO_ESPECIES_REQUEST,
  LISTA_CONSULTA_INVENTARIO_ESPECIES_SUCCESS,
  LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL,
} from '../../types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../../../services/axiosConfig';

export const listaConsultaInventarioEspecieActions = (nInventario: string) => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: LISTA_CONSULTA_INVENTARIO_ESPECIES_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/ReporteConsultaInventarioEspecie?nInventario=${nInventario}`);

    if (res.status === 200) {
      if (res.data?.length) {
        dispatch({
          type: LISTA_CONSULTA_INVENTARIO_ESPECIES_SUCCESS,
          payload: res.data
        });
        return true;
      }
      else {
        dispatch({
          type: LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL,
          payload: []
        });
        return false;
      }

    } else {
      dispatch({ type: LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL });
    }
    return false;
  } catch (err: any) {
    dispatch({
      type: LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL,
      error: "Error en la solicitud:", err,
    });
    return false;
  }
};
