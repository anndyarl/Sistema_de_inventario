import axios from 'axios';
import {
  VALIDA_PORTAL_REQUEST,
  VALIDA_PORTAL_SUCCESS,
  VALIDA_PORTAL_FAIL,
} from './types';
import { Dispatch } from 'redux';

export const validaApiloginActions = (rut: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

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

      const objeto = res.data[0]?.objeto ?? {};  // Acceder al primer elemento del array
      const esValido = res.data[0]?.esValido ?? {}; // Verifica si existe, de lo contrario usa false
      if (res.status === 200) {
        // Verifica si la clave 'EsValido' existe en el objeto
        if (esValido) {
          dispatch({
            type: VALIDA_PORTAL_SUCCESS,
            payload: objeto
          });
          return true;
        } else {
          return false;
        }
      } else {
        dispatch({
          type: VALIDA_PORTAL_FAIL,
          error:
            "No se pudo obtener los datos del usuario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: VALIDA_PORTAL_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
      return false;
    }
  } else {
    dispatch({
      type: VALIDA_PORTAL_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};