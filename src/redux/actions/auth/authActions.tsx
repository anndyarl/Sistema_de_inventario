import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REFRESH_TOKEN_SUCCESS,
} from './types';
import { Dispatch } from 'redux';

export const authActions = (usuario: string, password: string) => async (dispatch: Dispatch): Promise<boolean> => {
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
    const res = await axios.post(`${import.meta.env.VITE_CSRF_API_LOGIN}`, body, config);

    if (res.status === 200) {
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;

      if (accessToken && refreshToken) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            token: accessToken,
            refreshToken: refreshToken
          }
        });
        return true;
      } else {
        dispatch({
          type: LOGIN_FAIL,
          payload: { error: 'Tokens no encontrados en la respuesta del servidor' },
        });
        return false;
      }
    } else {
      dispatch({
        type: LOGIN_FAIL,
        payload: { error: `Error en la respuesta del servidor: ${res.status}` },
      });
      return false;
    }
  } catch (err: any) {
    dispatch({
      type: LOGIN_FAIL,
      payload: { error: err.response?.data?.message || '500 (Internal Server Error)' },
    });
    return false;
  }
};

export const refreshTokenAction = () => async (dispatch: Dispatch, getState: any) => {
  try {
    const { token, refreshToken } = getState().loginReducer;

    console.log("REFRESH TOKEN - INICIO");
    // console.log("URL desde .env:", import.meta.env.VITE_CSRF_REFRESH_TOKEN);
    console.log("Token actual:", token?.substring(0, 30));
    console.log("RefreshToken:", refreshToken?.substring(0, 30));

    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    const response = await axios.post(`${import.meta.env.VITE_CSRF_REFRESH_TOKEN}`, { accessToken: token, refreshToken: refreshToken });

    // console.log("Respuesta refresh:", {
    //   status: response.status,
    //   data: response.data
    // });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    dispatch({
      type: REFRESH_TOKEN_SUCCESS,
      payload: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });

    // console.log("REFRESH COMPLETADO - Nuevo token:", accessToken?.substring(0, 30));

    return accessToken;

  } catch (error: any) {
    console.error("Error en refreshTokenAction:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });

    dispatch({ type: LOGOUT });
    throw error;
  }
};

export const logout = () => ({
  type: LOGOUT
});