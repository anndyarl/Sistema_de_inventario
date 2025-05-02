// reducers/origenPresupuestoReducer.ts
import {
  CUENTA_MODIFICAR_REQUEST,
  CUENTA_MODIFICAR_SUCCESS,
  CUENTA_MODIFICAR_FAIL,

} from '../../../actions/Inventario/types';

interface CuentaState {
  loading: boolean;
  comboCuenta: Array<{ codigo: number; descripcion: string }>;
  error: string | null;
}

const initialState: CuentaState = {
  loading: false,
  comboCuenta: [],
  error: null,
};

const comboCuentaModificarReducers = (state = initialState, action: any): CuentaState => {
  switch (action.type) {
    case CUENTA_MODIFICAR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case CUENTA_MODIFICAR_SUCCESS:
      return {
        ...state,
        loading: false,
        comboCuenta: action.payload
      };
    case CUENTA_MODIFICAR_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboCuentaModificarReducers;
