
import {
  LISTA_MANTENEDOR_DEPENDENCIA_REQUEST,
  LISTA_MANTENEDOR_DEPENDENCIA_SUCCESS,
  LISTA_MANTENEDOR_DEPENDENCIA_FAIL
} from '../../../actions/Mantenedores/types'

// Define el tipo para el estado inicial
interface PropsState {
  listadoMantenedor: Array<{
    deP_CORR: number;
    deP_COD: string;
    seR_COD: number;
    nombre: string;
    vig: string;
    usuario: string;
    ip: string;
    num: number;
    fechA_CREA: string;
  }>;
}
// Estado inicial tipado
const initialState: PropsState = {
  listadoMantenedor: []
};

// Reducer con tipos definidos
const listadoMantenedorDependenciasReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_MANTENEDOR_DEPENDENCIA_REQUEST:
      return { ...state, loading: true };
    case LISTA_MANTENEDOR_DEPENDENCIA_SUCCESS:
      return {
        ...state,
        loading: false,
        listadoMantenedor: action.payload,
      };
    case LISTA_MANTENEDOR_DEPENDENCIA_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default listadoMantenedorDependenciasReducers;
