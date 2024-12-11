import {
  DEPARTAMENTO_REQUEST,
  DEPARTAMENTO_SUCCESS,
  DEPARTAMENTO_FAIL,

} from '../../../actions/Traslados/types';

interface DepartamentoState {
  loading: boolean;
  comboDepartamento: Array<{ codigo: number; descripcion: string }>;
  error: string | null;
}

const initialState: DepartamentoState = {
  loading: false,
  comboDepartamento: [],
  error: null,
};

const comboDepartamentoReducer = (state = initialState, action: any): DepartamentoState => {
  switch (action.type) {
    case DEPARTAMENTO_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DEPARTAMENTO_SUCCESS:
      return {
        ...state,
        loading: false,
        comboDepartamento: action.payload
      };
    case DEPARTAMENTO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboDepartamentoReducer;
