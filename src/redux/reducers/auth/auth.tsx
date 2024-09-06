import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,   
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
    token:string | null;   
}

// Estado inicial
const initialState: AuthState = {
    user: null,
    access: null,
    isAuthenticated: false,
    loading: false,   
    error: null, // Inicializa error como null
    token:null
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
            // localStorage.setItem('access', payload.access); // Guarda el token solo al login exitoso
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access || null,
                user: payload.user || null,
                loading: false,
                token: payload.access_token 
            };
        case LOGIN_FAIL: 
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                loading: false,
                error: payload,
            };   
        case LOGOUT:
            localStorage.removeItem('access');
            return initialState;
        case SET_TOKEN:
             return {
                ...state,
                token: payload,               
             }       
        default:
            return state;
    }
}
