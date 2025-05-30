
import { ListaAltas } from '../../../../components/Altas/RegistrarAltas';
import {
  OBTENER_ALTAS_REQUEST,
  OBTENER_ALTAS_SUCCESS,
  OBTENER_ALTAS_FAIL
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosInventarioState {
  listaAltas: ListaAltas[];
}
// Estado inicial tipado
const initialState: DatosInventarioState = {
  listaAltas: []
};

// Reducer con tipos definidos
const listaAltasReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case OBTENER_ALTAS_REQUEST:
      return { ...state, loading: true };
    case OBTENER_ALTAS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaAltas: action.payload,
      };
    case OBTENER_ALTAS_FAIL:
      return {
        ...state, loading: false,
        error: action.error,
        listaAltas: []
      };
    default:
      return state;
  }
};



export default listaAltasReducers;
