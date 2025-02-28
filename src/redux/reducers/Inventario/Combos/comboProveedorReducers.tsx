// reducers/origenPresupuestoReducer.ts
import {
  COMBO_PROVEEDORES_REQUEST,
  COMBO_PROVEEDORES_SUCCESS,
  COMBO_PROVEEDORES_FAIL

} from '../../../actions/Inventario/types';

interface ProveedorState {
  loading: boolean;
  comboProveedor: Array<{ proV_RUN: number; proV_NOMBRE: string; }>;
  error: string | null;
}

const initialState: ProveedorState = {
  loading: false,
  comboProveedor: [],
  error: null,
};


const comboProveedorReducers = (state = initialState, action: any): ProveedorState => {
  switch (action.type) {
    case COMBO_PROVEEDORES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case COMBO_PROVEEDORES_SUCCESS:
      return {
        ...state,
        loading: false,
        comboProveedor: action.payload
      };
    case COMBO_PROVEEDORES_FAIL:
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
