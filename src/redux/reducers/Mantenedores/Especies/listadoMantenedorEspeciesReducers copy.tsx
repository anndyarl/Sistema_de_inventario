
import {
  LISTA_MANTENEDOR_ESPECIES_REQUEST,
  LISTA_MANTENEDOR_ESPECIES_SUCCESS,
  LISTA_MANTENEDOR_ESPECIES_FAIL
} from '../../../actions/Mantenedores/types'

// Define el tipo para el estado inicial
interface PropsState {
  listadoMantenedor: Array<{
    esP_CODIGO: string;
    esP_NOMBRE: string;
    ctA_NOMBRE: string;
    esP_VIGENTE: string;
    esP_USER_CREA: string;
    estabL_NOMBRE: string;
    esP_IP_CREA: string;
    esP_VIDAUTIL: number;
  }>;
}
// Estado inicial tipado
const initialState: PropsState = {
  listadoMantenedor: []
};

// Reducer con tipos definidos
const listadoMantenedorEspeciesReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_MANTENEDOR_ESPECIES_REQUEST:
      return { ...state, loading: true };
    case LISTA_MANTENEDOR_ESPECIES_SUCCESS:
      return {
        ...state,
        loading: false,
        listadoMantenedor: action.payload,
      };
    case LISTA_MANTENEDOR_ESPECIES_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default listadoMantenedorEspeciesReducers;
