
import {
  LISTA_INDICADORES_REQUEST,
  LISTA_UTM_SUCCESS,
  LISTA_UF_SUCCESS,
  LISTA_DOLAR_SUCCESS,
  LISTA_BITCOIN_SUCCESS,
  LISTA_IPC_SUCCESS,
  LISTA_INDICADORES_FAIL
} from '../../actions/Otros/types'

// Define el tipo para el estado inicial
interface IndicadoresState {
  utm: {
    valor: number;
  };
  uf: {
    valor: number;
  };
  dolar: {
    valor: number;
  };
  bitcoin: {
    valor: number;
  };
  ipc: {
    valor: number;
  };
}
// Estado inicial tipado
const initialState: IndicadoresState = {
  utm: {
    valor: 0,
  },
  uf: {
    valor: 0,
  },
  dolar: {
    valor: 0,
  },
  bitcoin: {
    valor: 0,
  },
  ipc: {
    valor: 0,
  },
};

// Reducer con tipos definidos
const indicadoresReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_INDICADORES_REQUEST:
      return { ...state, loading: true };
    case LISTA_UTM_SUCCESS:
      return {
        ...state,
        loading: false,
        utm: action.payload,
      };
    case LISTA_UF_SUCCESS:
      return {
        ...state,
        loading: false,
        uf: action.payload,
      };
    case LISTA_DOLAR_SUCCESS:
      return {
        ...state,
        loading: false,
        dolar: action.payload,
      };
    case LISTA_BITCOIN_SUCCESS:
      return {
        ...state,
        loading: false,
        bitcoin: action.payload,
      };
    case LISTA_IPC_SUCCESS:
      return {
        ...state,
        loading: false,
        ipc: action.payload,
      };
    case LISTA_INDICADORES_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default indicadoresReducers;
