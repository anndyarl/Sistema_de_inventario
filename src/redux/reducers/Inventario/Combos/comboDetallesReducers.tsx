// reducers/origenPresupuestoReducer.ts
import {
  BIEN_DETALLES_REQUEST,
  BIEN_DETALLES_SUCCESS,
  BIEN_DETALLES_FAIL,
  BIEN_SUCCESS

} from '../../../actions/Inventario/types';

interface DetallesState {
  loading: boolean;
  comboBien: Array<{ codigo: string; descripcion: string }>;
  comboDetalle: Array<{ codigo: string; descripcion: string }>;
  error: string | null;
}

const initialState: DetallesState = {
  loading: false,
  comboBien: [],
  comboDetalle: [],
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
        comboDetalle: action.payload
      };
    case BIEN_SUCCESS:
      return {
        ...state,
        loading: false,
        comboBien: action.payload
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
