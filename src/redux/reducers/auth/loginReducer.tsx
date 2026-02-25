import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ORIGEN_LOGIN,
  REFRESH_TOKEN_SUCCESS,
} from "../../actions/auth/types";

// Define la estructura del estado
interface AuthState {
  loading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  logout: any;
  isAuthenticated: boolean;
  origenLogin: number;
}

// Estado inicial - SIN localStorage porque ya tienes redux-persist
const initialState: AuthState = {
  loading: true,
  error: null,
  token: null,
  refreshToken: null,
  logout: null,
  isAuthenticated: false,
  origenLogin: 0,
};

function loginReducer(state = initialState, action: any): AuthState {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        error: null
      };

    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        token: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true
      };

    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        token: null,
        refreshToken: null,
        isAuthenticated: false
      };

    case LOGOUT:
      return {
        ...initialState,
        loading: false,
        isAuthenticated: false
      };

    case ORIGEN_LOGIN:
      return { ...state, origenLogin: action.payload };

    default:
      return state;
  }
}

export default loginReducer;