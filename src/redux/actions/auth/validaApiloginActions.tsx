import axios from 'axios';
import {
  VALIDA_PORTAL_REQUEST,
  VALIDA_PORTAL_SUCCESS,
  VALIDA_PORTAL_FAIL,
  LOGOUT, // <-- Añadido
} from './types';
import { Dispatch } from 'redux';
import axiosInstance from '../../../services/axiosConfig';

export const validaApiloginActions = (rut: string) => async (dispatch: Dispatch): Promise<number> => {

  dispatch({ type: VALIDA_PORTAL_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/ValidaApilogin?rut=${rut}`);

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
      error: "Error en la solicitud:", err,
    });
    dispatch({ type: LOGOUT });
    return -1;
  }
};
