import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    UNIDADES_SUCCESS,
    UNIDADES_FAIL,
    LOGOUT
} from '../actions/auth/types';

// Define la estructura del estado
interface AuthState {
    user: any; // Define el tipo de usuario si lo conoces
    access: string | null;
    isAuthenticated: boolean | null;
    loading: boolean;
    unidades: any[]; // Añade unidades al estado
    error: string | null; // Añade error al estado
}

// Estado inicial
const initialState: AuthState = {
    user: null,
    access: localStorage.getItem('access'),
    isAuthenticated: localStorage.getItem('access') !== null,
    loading: false,
    unidades: [], // Inicializa unidades como un array vacío
    error: null, // Inicializa error como null
};

// Define el tipo de acción
interface Action {
    type: string;
    payload?: any;
}

export default function auth(state = initialState, action: Action): AuthState {
    const { type, payload } = action;

    switch (type) {
        case SET_AUTH_LOADING:
            return {
                ...state,
                loading: true,
            };
        case REMOVE_AUTH_LOADING:
            return {
                ...state,
                loading: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                access: payload.token, // Asigna el token recibido al estado
                user: payload.user || null, // Asigna el usuario si está disponible
                loading: false,
            };
        case LOGIN_FAIL:       
        case LOGOUT:
            localStorage.removeItem('access');
            return {
                ...state,
                access: null,
                isAuthenticated: false,
                user: null,
                unidades: [], // Limpia las unidades en el estado
                loading: false,
            };
        case UNIDADES_SUCCESS:
            return {
                ...state,
                access: payload.token, // Actualiza el token en el estado
            };
        case UNIDADES_FAIL:    
        case 'REFRESH_UNIDADES': // Asegúrate de que este tipo de acción coincida con el tipo usado en tus acciones
            return {
                ...state,
                unidades: payload, // Actualiza las unidades en el estado
            };
        default:
            return state;
    }
}
