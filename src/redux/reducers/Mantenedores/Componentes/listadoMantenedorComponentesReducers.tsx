
import {
  LISTA_MANTENEDOR_COMPONENTES_REQUEST,
  LISTA_MANTENEDOR_COMPONENTES_SUCCESS,
  LISTA_MANTENEDOR_COMPONENTES_FAIL
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
const listadoMantenedorComponentesReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_MANTENEDOR_COMPONENTES_REQUEST:
      return { ...state, loading: true };
    case LISTA_MANTENEDOR_COMPONENTES_SUCCESS:
      return {
        ...state,
        loading: false,
        listadoMantenedor: action.payload,
      };
    case LISTA_MANTENEDOR_COMPONENTES_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default listadoMantenedorComponentesReducers;
