// reducers/DESTINOPresupuestoReducer.ts
import {
  COMBO_DEPENDENCIA_DESTINO_REQUEST,
  COMBO_DEPENDENCIA_DESTINO_SUCCESS,
  COMBO_DEPENDENCIA_DESTINO_FAIL

} from '../../../actions/Traslados/types';

interface DependenciaState {
  loading: boolean;
  comboDependenciaDestino: Array<{ codigo: number; descripcion: string; nombrE_ORD: string; }>;
  error: string | null;
}

const initialState: DependenciaState = {
  loading: false,
  comboDependenciaDestino: [],
  error: null,
};

const comboDependenciaDestinoReducer = (state = initialState, action: any): DependenciaState => {
  switch (action.type) {
    case COMBO_DEPENDENCIA_DESTINO_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case COMBO_DEPENDENCIA_DESTINO_SUCCESS:
      return {
        ...state,
        loading: false,
        comboDependenciaDestino: action.payload
      };
    case COMBO_DEPENDENCIA_DESTINO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboDependenciaDestinoReducer;
