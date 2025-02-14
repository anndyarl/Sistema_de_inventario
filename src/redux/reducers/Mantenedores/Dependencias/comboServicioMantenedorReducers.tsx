// reducers/origenPresupuestoReducer.ts
import {
  COMBO_M_SERVICIO_REQUEST,
  COMBO_M_SERVICIO_SUCCESS,
  COMBO_M_SERVICIO_FAIL,

} from '../../../actions/Mantenedores/types'

interface ServicioState {
  loading: boolean;
  comboServicio: Array<{ codigo: number; nombrE_ORD: string; descripcion: string }>;
  error: string | null;
}

const initialState: ServicioState = {
  loading: false,
  comboServicio: [],
  error: null,
};

const comboServicioMantenedorReducers = (state = initialState, action: any): ServicioState => {
  switch (action.type) {
    case COMBO_M_SERVICIO_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case COMBO_M_SERVICIO_SUCCESS:
      return {
        ...state,
        loading: false,
        comboServicio: action.payload
      };
    case COMBO_M_SERVICIO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboServicioMantenedorReducers;
