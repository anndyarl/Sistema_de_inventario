
import {
  OBTENER_MAX_SERVICIO_REQUEST,
  OBTENER_MAX_SERVICIO_SUCCESS,
  OBTENER_MAX_SERVICIO_FAIL
} from '../../../actions/Mantenedores/types'

// Define el tipo para el estado inicial
interface PropsState {
  loading: boolean;
  seR_CORR: number;
  error: string | null;
}
// Estado inicial tipado
const initialState: PropsState = {
  loading: false,
  seR_CORR: 0,
  error: null,
};

// Reducer con tipos definidos
const obtenerMaxServicioReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case OBTENER_MAX_SERVICIO_REQUEST:
      return { ...state, loading: true };
    case OBTENER_MAX_SERVICIO_SUCCESS:
      return {
        ...state,
        loading: false,
        seR_CORR: action.payload,
      };
    case OBTENER_MAX_SERVICIO_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default obtenerMaxServicioReducers;
