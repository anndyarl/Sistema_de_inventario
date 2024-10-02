// reducers/origenPresupuestoReducer.ts
import {
  BIEN_DETALLES_REQUEST,
  BIEN_DETALLES_SUCCESS,
  BIEN_DETALLES_FAIL,
  BIEN_SUCCESS

} from '../../actions/types';

interface DetallesState {
  loading: boolean;
  bien: Array<{ codigo: string; descripcion: string }>;
  detalles: Array<{ codigo: string; descripcion: string }>;
  error: string | null;
}

const initialState: DetallesState = {
  loading: false,
  bien: [],
  detalles: [],
  error: null,
};

const detallesReducer = (state = initialState, action: any): DetallesState => {
  switch (action.type) {
    case BIEN_DETALLES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case BIEN_DETALLES_SUCCESS:
      return {
        ...state,
        loading: false,
        detalles: action.payload
      };
    case BIEN_SUCCESS:
      return {
        ...state,
        loading: false,
        bien: action.payload
      };
    case BIEN_DETALLES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default detallesReducer;
