import axios from 'axios';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,  
    SET_TOKEN,
    LOGOUT,
    
} from '../types';
import { Dispatch } from 'redux';
import { DatosPersona } from "../../interfaces"


export const login = (usuario: string, password: string) => async (dispatch: Dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = JSON.stringify({
        usuario,
        password,
    });

    try {
        const res = await axios.post('/api_inv/api/data/Login', body, config);
    
        console.log('Respuesta del servidor:', res);

        if (res.status === 200) {
   
            const token = res.data.access_token;  
            if (token) {               
                dispatch({ type: LOGIN_SUCCESS, payload: token });
                dispatch({ type: SET_TOKEN, payload: token });
            
            } else {
                console.error('Token no encontrado en la respuesta del servidor');
                dispatch({ type: LOGIN_FAILURE });
               
            }
        } else {
            console.error('Error en la respuesta del servidor:', res.status);
            dispatch({ type: LOGIN_FAILURE });
        }
    } catch (err) {
        console.error('Error en la solicitud:', err);
        dispatch({ type: LOGIN_FAILURE });
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
          dispatch({ type: LOGIN_FAILURE });
        }
      } else {
        console.error('Error en la respuesta del servidor:', res.status);
        dispatch({ type: LOGIN_FAILURE });
      }
    } catch (err) {
      console.error('Error en la solicitud:', err);
      dispatch({ type: LOGIN_FAILURE });
    }
  };

export const logout = () => {
    return {
      type: LOGOUT,
    };
  };

  export const checkAuthStatus = () => (dispatch: Dispatch) => {
    const token = localStorage.getItem('token');

    if (token) {
        dispatch({ type: SET_TOKEN, payload: token });
        dispatch({ type: LOGIN_SUCCESS, payload: token }); // Asume que el token es válido
    } else {
        dispatch({ type: LOGIN_FAILURE, payload: { error: 'No se encontró un token' } });
    }
}; 

//endpoint que se consulta con parametro token recibido
 // https://sidra.ssmso.cl/api_erp_inv_qa/api/claveunica/validarportal/