import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_TOKEN
} from '../../actions/types';


// Define la estructura del estado
interface AuthState {
    user: any; // Define el tipo de usuario si lo conoces
    access: string | null;
    isAuthenticated: boolean | null;
    loading: boolean;
    error: string | null; // Añade error al estado
    token: string | null;
    logout: any;
}

// Estado inicial
const initialState: AuthState = {
    user: null,
    access: null,
    isAuthenticated: false,
    loading: false,
    error: null, // Inicializa error como null
    token: null,
    logout: null,
};

// Define el tipo de acción
interface Action {
    type: string;
    payload?: any;
}

export default function auth(state = initialState, action: Action): AuthState {
    const { type, payload } = action;

    switch (type) {
        case LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, loading: false, token: payload, isAuthenticated: true };
        case LOGIN_FAIL:
            return { ...state, loading: false, error: action.payload, isAuthenticated: false, token: null };
        case LOGOUT:
            localStorage.removeItem('token');
            return { ...state, logout: action.payload, isAuthenticated: false, token: null };

        case SET_TOKEN:
            return { ...state, token: payload }
        default:
            return state;
    }
}
