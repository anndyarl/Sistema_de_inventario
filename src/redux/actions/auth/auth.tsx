import axios from 'axios';
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    UNIDADES_SUCCESS,
    UNIDADES_FAIL,
    UNIDADES_REQUEST,
    SET_TOKEN
    // LOGOUT
} from './types';
import { Dispatch } from 'redux';

// Acción para establecer el token
export const setToken = (token: string) => ({
    type: SET_TOKEN,
    payload: token,
});

export const login = (usuario: string, password: string) => async (dispatch: Dispatch) => {
    dispatch({
        type: SET_AUTH_LOADING,
    });

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
        const res = await axios.post('/api/api/data/Login', body, config);

        // Verifica la respuesta completa en la consola
        console.log('Respuesta del servidor:', res);

        if (res.status === 200) {
            // Asegúrate de que `res.data` contiene `access_token`
            const token = res.data.access_token;  // Usa `access_token` en lugar de `token`
            if (token) {
                localStorage.setItem('access', token); // Guarda el token en localStorage
                dispatch(setToken(token)); // Guarda el token en el estado global
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
    } finally {
        dispatch({ type: REMOVE_AUTH_LOADING });
    }
};

// Acción para obtener unidades
export const buscar_unidades = (token: string) => async (dispatch: Dispatch) => {
    if (token) {    
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        };

        dispatch({ type: UNIDADES_REQUEST });

        try {
            const res = await axios.get('/api/api/documento/obtenerUnidades', config);
            console.log('Respuesta del servidor obtener unidades:', res); // Verifica la respuesta en la consola

            if (res.status === 200) {
                dispatch({
                    type: UNIDADES_SUCCESS,
                    payload: res.data
                }); 
            } else {
                dispatch({ type: UNIDADES_FAIL });
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            dispatch({ type: UNIDADES_FAIL });
        }
    } else {
        dispatch({ type: UNIDADES_FAIL });
    }
};
