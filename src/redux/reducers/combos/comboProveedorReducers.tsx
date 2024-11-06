// reducers/origenPresupuestoReducer.ts
import {
  PROVEEDORES_REQUEST,
  PROVEEDORES_SUCCESS,
  PROVEEDORES_FAIL

} from '../../actions/types';

interface ProveedorState {
  loading: boolean;
  comboProveedor: Array<{ rut: number; nomprov: string; }>;
  error: string | null;
}

const initialState: ProveedorState = {
  loading: false,
  comboProveedor: [],
  error: null,
};


const comboProveedorReducers = (state = initialState, action: any): ProveedorState => {
  switch (action.type) {
    case PROVEEDORES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case PROVEEDORES_SUCCESS:
      return {
        ...state,
        loading: false,
        comboProveedor: action.payload
      };
    case PROVEEDORES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboProveedorReducers;
