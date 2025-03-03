
import {
  COMBO_CUENTAS_MANTENEDOR_REQUEST,
  COMBO_CUENTAS_MANTENEDOR_SUCCESS,
  COMBO_CUENTAS_MANTENEDOR_FAIL
} from '../../../actions/Mantenedores/types'

// Define el tipo para el estado inicial
interface PropsState {
  comboCuentaMantenedor: Array<{ esP_CODIGO: string; esP_NOMBRE: string; }>;
}
// Estado inicial tipado
const initialState: PropsState = {
  comboCuentaMantenedor: []
};

// Reducer con tipos definidos
const comboCuentaMantenedorReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case COMBO_CUENTAS_MANTENEDOR_REQUEST:
      return { ...state, loading: true };
    case COMBO_CUENTAS_MANTENEDOR_SUCCESS:
      return {
        ...state,
        loading: false,
        comboCuentaMantenedor: action.payload,
      };
    case COMBO_CUENTAS_MANTENEDOR_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default comboCuentaMantenedorReducers;
