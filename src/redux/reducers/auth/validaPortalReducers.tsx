import {
  VALIDA_PORTAL_REQUEST,
  VALIDA_PORTAL_SUCCESS,
  VALIDA_PORTAL_FAIL,
} from "../../actions/auth/types";

// Define la estructura del estado
interface AuthState {
  user: string;
  error: string | null;
}

// Estado inicial
const initialState: AuthState = {
  user: "",
  error: null
};

function validaPortalReducer(state = initialState, action: any): AuthState {
  switch (action.type) {
    case VALIDA_PORTAL_REQUEST:
      return { ...state, error: null };
    case VALIDA_PORTAL_SUCCESS:
      return { ...state, user: action.payload };
    case VALIDA_PORTAL_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
export default validaPortalReducer;
