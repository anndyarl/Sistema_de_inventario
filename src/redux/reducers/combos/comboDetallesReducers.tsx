// reducers/origenPresupuestoReducer.ts
import {
  BIEN_DETALLES_REQUEST,
  BIEN_DETALLES_SUCCESS,
  BIEN_DETALLES_FAIL,

} from '../../actions/types';

interface DetallesState {
  loading: boolean;
  detalles: Array<{ codigo: string; descripcion: string }>;
  error: string | null;
}

const initialState: DetallesState = {
  loading: false,
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
