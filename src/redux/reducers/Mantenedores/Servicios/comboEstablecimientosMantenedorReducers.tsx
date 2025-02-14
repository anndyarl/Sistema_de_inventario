
import {
  COMBO_M_ESTABLECIMIENTO_REQUEST,
  COMBO_M_ESTABLECIMIENTO_SUCCESS,
  COMBO_M_ESTABLECIMIENTO_FAIL
} from '../../../actions/Mantenedores/types'

// Define el tipo para el estado inicial
interface PropsState {
  loading: boolean;
  comboEstablecimiento: Array<{ codigo: number; descripcion: string; }>;
  error: string | null;


}
// Estado inicial tipado
const initialState: PropsState = {
  loading: false,
  comboEstablecimiento: [],
  error: null,
};

// Reducer con tipos definidos
const comboEstablecimientosMantenedorReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case COMBO_M_ESTABLECIMIENTO_REQUEST:
      return { ...state, loading: true };
    case COMBO_M_ESTABLECIMIENTO_SUCCESS:
      return {
        ...state,
        loading: false,
        comboEstablecimiento: action.payload,
      };
    case COMBO_M_ESTABLECIMIENTO_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default comboEstablecimientosMantenedorReducers;
