// reducers/origenPresupuestoReducer.ts
import {
  CUENTA_REQUEST,
  CUENTA_SUCCESS,
  CUENTA_FAIL,

} from '../../actions/types';

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

const comboCuentaReducer = (state = initialState, action: any): CuentaState => {
  switch (action.type) {
    case CUENTA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case CUENTA_SUCCESS:
      return {
        ...state,
        loading: false,
        comboCuenta: action.payload
      };
    case CUENTA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboCuentaReducer;
