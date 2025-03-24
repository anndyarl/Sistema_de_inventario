import axios from 'axios';
import {
  LISTA_ACTIVOS_CALCULADOS_REQUEST,
  LISTA_ACTIVOS_CALCULADOS_SUCCESS,
  LISTA_ACTIVOS_CALCULADOS_FAIL,
} from '../../types';
import { Dispatch } from 'redux';


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

    try {
      const res = await axios.post(`${import.meta.env.VITE_CSRF_API_URL}/CalculoDeInventario`, body, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_ACTIVOS_CALCULADOS_SUCCESS,
            payload: res.data
          });
          return true;
        }
        else {
          dispatch({ type: LISTA_ACTIVOS_CALCULADOS_FAIL });
          return false;
        }

      } else {
        dispatch({ type: LISTA_ACTIVOS_CALCULADOS_FAIL });
      }
      return false;
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: LISTA_ACTIVOS_CALCULADOS_FAIL });
      return false;
    }
  } else {
    dispatch({ type: LISTA_ACTIVOS_CALCULADOS_FAIL });
    return false;
  }
};
