// reducers/origenPresupuestoReducer.ts
import {
  DEPENDENCIA_REQUEST,
  DEPENDENCIA_SUCCESS,
  DEPENDENCIA_FAIL

} from '../../actions/types';

interface DependenciaState {
  loading: boolean;
  dependencias: Array<{ codigo: number; descripcion: string; nombrE_ORD: string; }>;
  error: string | null;
}

const initialState: DependenciaState = {
  loading: false,
  dependencias: [],
  error: null,
};

const dependenciaReducer = (state = initialState, action: any): DependenciaState => {
  switch (action.type) {
    case DEPENDENCIA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DEPENDENCIA_SUCCESS:
      return {
        ...state,
        loading: false,
        dependencias: action.payload
      };
    case DEPENDENCIA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default dependenciaReducer;
