
import {
  LISTA_MANTENEDOR_SERVICIO_REQUEST,
  LISTA_MANTENEDOR_SERVICIO_SUCCESS,
  LISTA_MANTENEDOR_SERVICIO_FAIL
} from '../../../actions/Mantenedores/types'

// Define el tipo para el estado inicial
interface PropsState {
  listadoMantenedor: Array<{
    seR_CORR: number;
    seR_COD: string;
    seR_NOMBRE: string;
    seR_USER_CREA: string;
    seR_VIGENTE: string;
    seR_F_CREA: string;
    seR_IP_CREA: string;
    estabL_NOMBRE: string;
  }>;
}
// Estado inicial tipado
const initialState: PropsState = {
  listadoMantenedor: []
};

// Reducer con tipos definidos
const listadoMantenedorServiciosReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_MANTENEDOR_SERVICIO_REQUEST:
      return { ...state, loading: true };
    case LISTA_MANTENEDOR_SERVICIO_SUCCESS:
      return {
        ...state,
        loading: false,
        listadoMantenedor: action.payload,
      };
    case LISTA_MANTENEDOR_SERVICIO_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default listadoMantenedorServiciosReducers;
