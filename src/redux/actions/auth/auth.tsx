import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_TOKEN,
  LOGOUT,

} from './types';
import { Dispatch } from 'redux';

export const login = (usuario: string, password: string) => async (dispatch: Dispatch) => {
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
    const res = await axios.post('https://sidra.ssmso.cl/api_erp_inv_qa/api/data/Login', body, config);
    // Validar si la respuesta es exitosa
    if (res.status === 200) {
      const token = res.data.access_token;

      if (token) {
        // Si se obtiene el token, realizar los dispatch correspondientes
        dispatch({ type: LOGIN_SUCCESS, payload: token });
        dispatch({ type: SET_TOKEN, payload: token });
      } else {
        // Si no se encuentra el token, manejar el error
        dispatch({
          type: LOGIN_FAIL,
          payload: { error: 'Token no encontrado en la respuesta del servidor' },
        });
      }
    } else {
      // Si la respuesta no es 200, manejar el error
      dispatch({
        type: LOGIN_FAIL,
        payload: { error: `Error en la respuesta del servidor: ${res.status}` },
      });
    }
  } catch (err: any) {
    // Manejo de errores en la solicitud
    dispatch({
      type: LOGIN_FAIL,
      payload: { error: err.response?.data?.message || '500 (Internal Server Error)' },
    });
  }
};

export const logout = () => async (dispatch: Dispatch): Promise<boolean> => {
  dispatch({ type: LOGOUT });
  return true;
};

//   const token = localStorage.getItem('token');

//   if (token) {
//     dispatch({ type: SET_TOKEN, payload: token });
//     dispatch({ type: LOGIN_SUCCESS, payload: token }); // Asume que el token es válido
//   } else {
//     dispatch({ type: LOGIN_FAIL });
//   }
// };

//endpoint que se consulta con parametro token recibido
// https://sidra.ssmso.cl/api_erp_inv_qa/api/claveunica/validarportal/