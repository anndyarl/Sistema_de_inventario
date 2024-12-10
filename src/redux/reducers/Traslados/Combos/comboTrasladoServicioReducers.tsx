// reducers/origenPresupuestoReducer.ts
import {
  TRASLADO_SERVICIO_REQUEST,
  TRASLADO_SERVICIO_SUCCESS,
  TRASLADO_SERVICIO_FAIL,

} from '../../../actions/Traslados/types';

interface ServicioState {
  loading: boolean;
  comboTrasladoServicio: Array<{ codigo: number; descripcion: string }>;
  error: string | null;
}

const initialState: ServicioState = {
  loading: false,
  comboTrasladoServicio: [],
  error: null,
};

const comboTrasladoServicioReducer = (state = initialState, action: any): ServicioState => {
  switch (action.type) {
    case TRASLADO_SERVICIO_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case TRASLADO_SERVICIO_SUCCESS:
      return {
        ...state,
        loading: false,
        comboTrasladoServicio: action.payload
      };
    case TRASLADO_SERVICIO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboTrasladoServicioReducer;
