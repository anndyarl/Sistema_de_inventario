import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_TOKEN,
  LOGOUT,

} from '../types';
import { Dispatch } from 'redux';
import { DatosPersona } from "../../interfaces"


export const login = (usuario: string, password: string) => async (dispatch: Dispatch) => {

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    usuario,
    password,
  });
  dispatch({ type: LOGIN_REQUEST });

  try {
    const res = await axios.post('/api_inv/api/data/Login', body, config);

    // console.log('Respuesta del servidor:', res);

    if (res.status === 200) {

      const token = res.data.access_token;
      if (token) {
        dispatch({ type: LOGIN_SUCCESS, payload: token });
        dispatch({ type: SET_TOKEN, payload: token });

      } else {
        // console.error('Token no encontrado en la respuesta del servidor');
        dispatch({ type: LOGIN_FAIL, payload: { error: 'Token no encontrado en la respuesta del servidor' } });

      }
    } else {
      // console.error('Error en la respuesta del servidor:', res.status);
      dispatch({ type: LOGIN_FAIL, payload: { error: 'Error en la respuesta del servidor' } });
    }
  } catch (err) {
    // console.error('Error en la solicitud:', err);
    dispatch({ type: LOGIN_FAIL, payload: { error: '500 (Internal Server Error)' } });
  }
};

export const loginClaveUnica = (datosPersona: DatosPersona) => async (dispatch: Dispatch) => {


  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {

    //Desarollo(aqui se obtiene el token)
    const res = await axios.post('https://sidra.ssmso.cl/Wcf_ClaveUnica/?url_solicitud=http://localhost:44364/SSMSO_BIENESTAR/ClaveUnica/validarportal/', datosPersona, config);

    //Producción sin parametros
    //const res = await axios.post('https://sidra.ssmso.cl/Wcf_ClaveUnica/?url_solicitud=http://localhost:44364/SSMSO_BIENESTAR/ClaveUnica/validarportal/');


    console.log('Respuesta del servidor:', res);

    if (res.status === 200) {
      const token = res.data.access_token;
      if (token) {
        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
        dispatch({ type: SET_TOKEN, payload: token });
      } else {
        console.error('Token no encontrado en la respuesta del servidor');
        dispatch({ type: LOGIN_FAIL });
      }
    } else {
      console.error('Error en la respuesta del servidor:', res.status);
      dispatch({ type: LOGIN_FAIL });
    }
  } catch (err) {
    console.error('Error en la solicitud:', err);
    dispatch({ type: LOGIN_FAIL });
  }
};

export const logout = () => (dispatch: Dispatch) => {
  dispatch({ type: LOGOUT });
};

export const checkAuthStatus = () => (dispatch: Dispatch) => {
  const token = localStorage.getItem('token');

  if (token) {
    dispatch({ type: SET_TOKEN, payload: token });
    dispatch({ type: LOGIN_SUCCESS, payload: token }); // Asume que el token es válido
  } else {
    dispatch({ type: LOGIN_FAIL });
  }
};

//endpoint que se consulta con parametro token recibido
// https://sidra.ssmso.cl/api_erp_inv_qa/api/claveunica/validarportal/