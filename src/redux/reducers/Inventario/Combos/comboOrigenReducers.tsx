// reducers/origenPresupuestoReducer.tsx
import {
  ORIGEN_REQUEST,
  ORIGEN_SUCCESS,
  ORIGEN_FAIL,

} from '../../../actions/Inventario/types';

interface OrigenPresupuestoState {
  loading: boolean;
  comboOrigen: Array<{ codigo: number; descripcion: string }>;
  error: string | null;
}

const initialState: OrigenPresupuestoState = {
  loading: false,
  comboOrigen: [],
  error: null,
};

const comboOrigenPresupuestoReducer = (state = initialState, action: any): OrigenPresupuestoState => {
  switch (action.type) {
    case ORIGEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ORIGEN_SUCCESS:
      return {
        ...state,
        loading: false,
        comboOrigen: action.payload
      };
    case ORIGEN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboOrigenPresupuestoReducer;
