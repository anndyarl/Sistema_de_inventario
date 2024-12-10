// reducers/origenPresupuestoReducer.ts
import {
  TRASLADO_ESPECIE_REQUEST,
  TRASLADO_ESPECIE_SUCCESS,
  TRASLADO_ESPECIE_FAIL,

} from '../../../actions/Traslados/types';

interface EspecieState {
  loading: boolean;
  comboTrasladoEspecie: Array<{ codigo: number; descripcion: string }>;
  error: string | null;
}

const initialState: EspecieState = {
  loading: false,
  comboTrasladoEspecie: [],
  error: null,
};

const comboTrasladoEspecieReducer = (state = initialState, action: any): EspecieState => {
  switch (action.type) {
    case TRASLADO_ESPECIE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case TRASLADO_ESPECIE_SUCCESS:
      return {
        ...state,
        loading: false,
        comboTrasladoEspecie: action.payload
      };
    case TRASLADO_ESPECIE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboTrasladoEspecieReducer;
