import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_TOKEN,
} from "../../actions/types";

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
  loading: true,
  error: null,
  token: null,
  logout: null,
};

function loginReducer(state = initialState, action: any): AuthState {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, token: action.payload.token, isAuthenticated: true };
    case LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload, isAuthenticated: false, token: null, };
    case LOGOUT:
      return { ...initialState, loading: false };
    case SET_TOKEN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
}
export default loginReducer;
