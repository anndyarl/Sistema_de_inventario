import axios from 'axios';
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    UNIDADES_SUCCESS,
    UNIDADES_FAIL,
    // LOGOUT
} from './types';
import { Dispatch } from 'redux';

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
        const res = await axios.post('/api/Api_Erp_Qa/api/data/Login', body, config);

        if (res.status === 200) {
            localStorage.setItem('access', res.data.token); // Guarda el token en localStorage
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });
            // Aquí puedes llamar a otra acción para obtener unidades si es necesario

            dispatch({
                type: REMOVE_AUTH_LOADING,
            });
        } else {
            dispatch({
                type: LOGIN_FAIL,
            });
            dispatch({
                type: REMOVE_AUTH_LOADING,
            });
        }
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL,
        });
        dispatch({
            type: REMOVE_AUTH_LOADING,
        });
    }
};

export const buscar_unidades = () => async (dispatch: Dispatch) => {
    const Token = localStorage.getItem('access');// Recupera el token del localStorage
    if (Token) {
        const config = {
            headers: {
                'Authorization': `Bearer ${Token}`,// Envia el token en los headers
                'Accept': 'application/json'
            },
        };

        try {
           const res = await axios.get('/api/documento/obtenerUnidades', config); // Usa la ruta relativa

            if (res.status === 200) {
                dispatch({
                    type: UNIDADES_SUCCESS,
                    payload: res.data, // Pasa los datos de las unidades como payload
                });
            } else {
                dispatch({
                    type: UNIDADES_FAIL,
                });
            }
        } catch (err) {
            console.error("Error en la solicitud:", err); // Muestra detalles del error en la consola
            dispatch({
                type: UNIDADES_FAIL,
            });
        }
    } else {
        dispatch({
            type: UNIDADES_FAIL,
        });
    }
};
