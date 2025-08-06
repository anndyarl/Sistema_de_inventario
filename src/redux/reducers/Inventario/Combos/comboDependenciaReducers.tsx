// reducers/origenPresupuestoReducer.ts
import { DEPENDENCIA } from '../../../../components/Inventario/RegistrarInventario/DatosCuenta';
import {
  DEPENDENCIA_REQUEST,
  DEPENDENCIA_SUCCESS,
  DEPENDENCIA_FAIL

} from '../../../actions/Inventario/types';

interface DependenciaState {
  loading: boolean;
  comboDependencia: DEPENDENCIA[];
  error: string | null;
}

const initialState: DependenciaState = {
  loading: false,
  comboDependencia: [],
  error: null,
};

const comboDependenciaReducer = (state = initialState, action: any): DependenciaState => {
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
        comboDependencia: action.payload
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

export default comboDependenciaReducer;
