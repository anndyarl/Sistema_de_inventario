import axios from 'axios';
import {
  VALIDA_PORTAL_REQUEST,
  VALIDA_PORTAL_SUCCESS,
  VALIDA_PORTAL_FAIL,
} from './types';
import { Dispatch } from 'redux';

export const validaPortalActions = (datosPersona: string, solicitudes: string) => async (dispatch: Dispatch, getState: any) => {
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
      const res = await axios.get(`https://sidra.ssmso.cl/api_erp_inv_qa/api/inventario/validarportal?datosPersona=${datosPersona}&solicitudes=${solicitudes}`, config);

      if (res.status === 200) {
        dispatch({
          type: VALIDA_PORTAL_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: VALIDA_PORTAL_FAIL,
          error:
            "No se pudo obtener los datos del usuario. Por favor, intente nuevamente.",
        });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({
        type: VALIDA_PORTAL_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
    }
  } else {
    dispatch({
      type: VALIDA_PORTAL_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
  }
};