// reducers/origenPresupuestoReducer.ts
import {
  MODALIDAD_COMPRA_REQUEST,
  MODALIDAD_COMPRA_SUCCESS,
  MODALIDAD_COMPRA_FAIL,

} from '../../actions/types';

interface ModalidadCompraState {
  loading: boolean;
  modalidades: Array<{ codigo: number, descripcion: string }>;
  error: string | null;
}

const initialState: ModalidadCompraState = {
  loading: false,
  modalidades: [],
  error: null,
};

const modalidadCompraReducer = (state = initialState, action: any): ModalidadCompraState => {
  switch (action.type) {
    case MODALIDAD_COMPRA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case MODALIDAD_COMPRA_SUCCESS:
      return {
        ...state,
        loading: false,
        modalidades: action.payload
      };
    case MODALIDAD_COMPRA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default modalidadCompraReducer;
