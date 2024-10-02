// reducers/origenPresupuestoReducer.ts
import {
  SERVICIO_REQUEST,
  SERVICIO_SUCCESS,
  SERVICIO_FAIL,

} from '../../actions/types';

interface ServicioState {
  loading: boolean;
  servicios: Array<{ codigo: number; nombrE_ORD: string; descripcion: string }>;
  error: string | null;
}

const initialState: ServicioState = {
  loading: false,
  servicios: [],
  error: null,
};

const servicioReducer = (state = initialState, action: any): ServicioState => {
  switch (action.type) {
    case SERVICIO_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case SERVICIO_SUCCESS:
      return {
        ...state,
        loading: false,
        servicios: action.payload
      };
    case SERVICIO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default servicioReducer;
