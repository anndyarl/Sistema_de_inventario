import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,

} from './types';
import { Dispatch } from 'redux';

export const login = (usuario: string, password: string) => async (dispatch: Dispatch): Promise<boolean> => {
  // Configuración de los headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Cuerpo de la solicitud
  const body = JSON.stringify({
    usuario,
    password,
  });

  // Dispatch de inicio de solicitud
  dispatch({ type: LOGIN_REQUEST });

  try {
    // Realizar la solicitud POST a la API
    const res = await axios.post(`${import.meta.env.VITE_CSRF_API_LOGIN}`, body, config);
    // Validar si la respuesta es exitosa
    if (res.status === 200) {
      const token = res.data.access_token;
      if (token) {
        // Si se obtiene el token, realizar los dispatch correspondientes
        dispatch({ type: LOGIN_SUCCESS, payload: token });
        return true;
      } else {
        // Si no se encuentra el token, manejar el error
        dispatch({
          type: LOGIN_FAIL,
          payload: { error: 'Token no encontrado en la respuesta del servidor' },
        });
        return false;
      }
    } else {
      // Si la respuesta no es 200, manejar el error
      dispatch({
        type: LOGIN_FAIL,
        payload: { error: `Error en la respuesta del servidor: ${res.status}` },
      });
      return false;
    }
  } catch (err: any) {
    // Manejo de errores en la solicitud
    dispatch({
      type: LOGIN_FAIL,
      payload: { error: err.response?.data?.message || '500 (Internal Server Error)' },
    });
    return false;
  }
};

export const logout = () => ({
  type: LOGOUT
});