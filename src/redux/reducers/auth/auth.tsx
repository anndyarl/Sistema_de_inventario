import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ORIGEN_LOGIN,
} from "../../actions/auth/types";

// Define la estructura del estado
interface AuthState {
  loading: boolean;
  error: string | null; // Añade error al estado
  token: string | null;
  logout: any;
  isAuthenticated: boolean;
  origenLogin: number;
}

// Estado inicial
const initialState: AuthState = {
  loading: true,
  error: null,
  token: null,
  logout: null,
  isAuthenticated: false,
  origenLogin: 0,
};

function loginReducer(state = initialState, action: any): AuthState {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, token: action.payload };
    case LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload, token: null };
    case LOGOUT:
      return { ...initialState, loading: false, isAuthenticated: false, token: null };
    case ORIGEN_LOGIN:
      return { ...state, origenLogin: action.payload };
    default:
      return state;
  }
}
export default loginReducer;
