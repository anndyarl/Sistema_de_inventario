import axios from 'axios';
import {
  COMBO_CUENTA_INFORME_REQUEST,
  COMBO_CUENTA_INFORME_SUCCESS,
  COMBO_CUENTA_INFORME_FAIL,
} from '../../types';
import { Dispatch } from 'redux';
import { LOGOUT } from '../../../auth/types';


// Acción para obtener COMBO_CUENTA_INFORME
export const comboCuentasInformeActions = () => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    };

    dispatch({ type: COMBO_CUENTA_INFORME_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeAllCuenta`, config);

      if (res.status === 200) {
        dispatch({
          type: COMBO_CUENTA_INFORME_SUCCESS,
          payload: res.data
        });
      } else {
        dispatch({ type: COMBO_CUENTA_INFORME_FAIL });
      }
    } catch (err: any) {
      dispatch({
        type: COMBO_CUENTA_INFORME_FAIL,
        error: "El token ha expirado.",
      });
      // dispatch({ type: LOGOUT });
      return false;
    }
  } else {
    dispatch({
      type: COMBO_CUENTA_INFORME_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return false;
  }
};
