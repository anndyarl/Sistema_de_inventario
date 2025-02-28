
import {
  OBTENER_MAX_PROVEEDOR_REQUEST,
  OBTENER_MAX_PROVEEDOR_SUCCESS,
  OBTENER_MAX_PROVEEDOR_FAIL
} from '../../../actions/Mantenedores/types'

// Define el tipo para el estado inicial
interface PropsState {
  loading: boolean;
  proV_CORR: number;
  error: string | null;
}
// Estado inicial tipado
const initialState: PropsState = {
  loading: false,
  proV_CORR: 0,
  error: null,
};

// Reducer con tipos definidos
const obtenerMaxProveedorReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case OBTENER_MAX_PROVEEDOR_REQUEST:
      return { ...state, loading: true };
    case OBTENER_MAX_PROVEEDOR_SUCCESS:
      return {
        ...state,
        loading: false,
        proV_CORR: action.payload,
      };
    case OBTENER_MAX_PROVEEDOR_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default obtenerMaxProveedorReducers;
