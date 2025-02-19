// reducers/origenPresupuestoReducer.ts
import {
  COMBO_DEPENDENCIA_ORIGEN_REQUEST,
  COMBO_DEPENDENCIA_ORIGEN_SUCCESS,
  COMBO_DEPENDENCIA_ORIGEN_FAIL

} from '../../../actions/Traslados/types';

interface DependenciaState {
  loading: boolean;
  comboDependenciaOrigen: Array<{ codigo: number; descripcion: string; nombrE_ORD: string; }>;
  error: string | null;
}

const initialState: DependenciaState = {
  loading: false,
  comboDependenciaOrigen: [],
  error: null,
};

const comboDependenciaOrigenReducer = (state = initialState, action: any): DependenciaState => {
  switch (action.type) {
    case COMBO_DEPENDENCIA_ORIGEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case COMBO_DEPENDENCIA_ORIGEN_SUCCESS:
      return {
        ...state,
        loading: false,
        comboDependenciaOrigen: action.payload
      };
    case COMBO_DEPENDENCIA_ORIGEN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboDependenciaOrigenReducer;
