import axios from 'axios';
import {
  VALIDA_PORTAL_REQUEST,
  VALIDA_PORTAL_SUCCESS,
  VALIDA_PORTAL_FAIL,
  LOGOUT, // <-- Añadido
} from './types';
import { Dispatch } from 'redux';

export const validaApiloginActions = (rut: string) => async (dispatch: Dispatch, getState: any): Promise<number> => {
  const token = getState().loginReducer.token;

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: VALIDA_PORTAL_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/ValidaApilogin?rut=${rut}`, config);

      const respuestaApiLogin = res.data?.respuestaApiLogin || [];
      const objeto = respuestaApiLogin.length > 0 ? respuestaApiLogin[0]?.objeto : {};
      const esValido = respuestaApiLogin.length > 0 ? respuestaApiLogin[0]?.esValido : false;
      const establecimiento = res.data?.establecimiento || "No disponible";
      const usr_run = res.data?.usr_run || "No disponible";

      if (res.status === 200) {
        if (esValido) {
          dispatch({
            type: VALIDA_PORTAL_SUCCESS,
            payload: { ...objeto, establecimiento, usr_run }
          });
          return 1;
        } else {
          dispatch({
            type: VALIDA_PORTAL_FAIL,
            error: "Usuario sin permisos.",
          });
          return 0;
        }
      } else {
        dispatch({
          type: VALIDA_PORTAL_FAIL,
          error: "No se pudo obtener los datos del usuario. Por favor, intente nuevamente.",
        });
        return -1;
      }

    } catch (err: any) {
      dispatch({
        type: VALIDA_PORTAL_FAIL,
        error: "El token ha expirado.",
      });
      dispatch({ type: LOGOUT });
      return -1;
    }
  } else {
    dispatch({
      type: VALIDA_PORTAL_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    dispatch({ type: LOGOUT });
    return -1;
  }
};
