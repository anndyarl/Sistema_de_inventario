import {
  LISTA_VERSIONAMIENTO_REQUEST,
  LISTA_VERSIONAMIENTO_SUCCESS,
  LISTA_VERSIONAMIENTO_FAIL,

} from '../../actions/Configuracion/types';

interface PropsState {
  loading: boolean;
  listaVersionamiento: Array<{
    numerO_VERSION: number;
    cambios: string;
    fecha: number;
    descripcion: string;
  }>;
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  listaVersionamiento: [],
  error: null,
};

const listaVersionamientoReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case LISTA_VERSIONAMIENTO_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LISTA_VERSIONAMIENTO_SUCCESS:
      return {
        ...state,
        loading: false,
        listaVersionamiento: action.payload
      };

    case LISTA_VERSIONAMIENTO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default listaVersionamientoReducers;
