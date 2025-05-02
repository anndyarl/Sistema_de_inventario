// reducers/origenPresupuestoReducer.ts
import {
  DEPENDENCIA_MODIFICAR_REQUEST,
  DEPENDENCIA_MODIFICAR_SUCCESS,
  DEPENDENCIA_MODIFICAR_FAIL
} from '../../../actions/Inventario/types';

interface DependenciaState {
  loading: boolean;
  comboDependencia: Array<{ codigo: number; descripcion: string; nombrE_ORD: string; }>;
  error: string | null;
}

const initialState: DependenciaState = {
  loading: false,
  comboDependencia: [],
  error: null,
};

const comboDependenciaModificarReducers = (state = initialState, action: any): DependenciaState => {
  switch (action.type) {
    case DEPENDENCIA_MODIFICAR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DEPENDENCIA_MODIFICAR_SUCCESS:
      return {
        ...state,
        loading: false,
        comboDependencia: action.payload
      };
    case DEPENDENCIA_MODIFICAR_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboDependenciaModificarReducers;
