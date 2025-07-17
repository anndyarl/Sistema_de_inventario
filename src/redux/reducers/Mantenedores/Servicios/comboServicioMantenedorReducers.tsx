// reducers/origenPresupuestoReducer.ts
import {
  COMBO_SERVICIO_MANTENEDOR_REQUEST,
  COMBO_SERVICIO_MANTENEDOR_SUCCESS,
  COMBO_SERVICIO_MANTENEDOR_FAIL,

} from '../../../actions/Mantenedores/types';

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
    case COMBO_SERVICIO_MANTENEDOR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case COMBO_SERVICIO_MANTENEDOR_SUCCESS:
      return {
        ...state,
        loading: false,
        comboServicio: action.payload
      };
    case COMBO_SERVICIO_MANTENEDOR_FAIL:
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
