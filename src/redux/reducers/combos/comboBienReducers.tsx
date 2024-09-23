// reducers/origenPresupuestoReducer.ts
import {
  BIEN_REQUEST,
  BIEN_SUCCESS,
  BIEN_FAIL,

} from '../../actions/types';

interface BienState {
  loading: boolean;
  bien: Array<{ codigo: number; descripcion: string }>;
  error: string | null;
}

const initialState: BienState = {
  loading: false,
  bien: [],
  error: null,
};

const bienReducer = (state = initialState, action: any): BienState => {
  switch (action.type) {
    case BIEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case BIEN_SUCCESS:
      return {
        ...state,
        loading: false,
        bien: action.payload
      };
    case BIEN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default bienReducer;
