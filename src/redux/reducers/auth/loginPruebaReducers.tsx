
import { ListadoUsuarios } from '../../../containers/pages/Login';
import {
  LOGIN_PRUEBA_REQUEST,
  LOGIN_PRUEBA_SUCCESS,
  LOGIN_PRUEBA_FAIL
} from '../../actions/auth/types'

// Define el tipo para el estado inicial
interface PropsState {
  loading: boolean;
  listadoUsuarios: ListadoUsuarios[];
  error: string | null;
}
// Estado inicial tipado
const initialState: PropsState = {
  loading: false,
  listadoUsuarios: [],
  error: null
};

// Reducer con tipos definidos
const loginPruebaReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LOGIN_PRUEBA_REQUEST:
      return { ...state, loading: true };
    case LOGIN_PRUEBA_SUCCESS:
      return {
        ...state,
        loading: false,
        listadoUsuarios: action.payload,
      };
    case LOGIN_PRUEBA_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default loginPruebaReducers;
