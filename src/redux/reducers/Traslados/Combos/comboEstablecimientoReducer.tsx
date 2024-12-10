import {
  ESTABLECIMIENTO_REQUEST,
  ESTABLECIMIENTO_SUCCESS,
  ESTABLECIMIENTO_FAIL,

} from '../../../actions/Traslados/types';

interface EstablecimientoState {
  loading: boolean;
  comboEstablecimiento: Array<{ codigo: number; descripcion: string }>;
  error: string | null;
}

const initialState: EstablecimientoState = {
  loading: false,
  comboEstablecimiento: [],
  error: null,
};

const comboEstablecimientoReducer = (state = initialState, action: any): EstablecimientoState => {
  switch (action.type) {
    case ESTABLECIMIENTO_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ESTABLECIMIENTO_SUCCESS:
      return {
        ...state,
        loading: false,
        comboEstablecimiento: action.payload
      };
    case ESTABLECIMIENTO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboEstablecimientoReducer;
