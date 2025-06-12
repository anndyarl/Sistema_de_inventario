
import { ListaSalidaTraslados } from '../../../components/Traslados/RegistrarTraslados';
import {
  POST_FORMULARIO_TRASLADO_REQUEST,
  POST_FORMULARIO_TRASLADO_SUCCESS,
  POST_FORMULARIO_TRASLADO_FAIL
} from '../../actions/Informes/types';

// Define el tipo para el estado inicial
interface DatosInventarioState {
  listaSalidaTraslados: ListaSalidaTraslados[];
}// Estado inicial tipado
const initialState: DatosInventarioState = {
  listaSalidaTraslados: []
};

// Reducer con tipos definidos
const datosTrasladoRegistradoReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case POST_FORMULARIO_TRASLADO_REQUEST:
      return { ...state, loading: true };
    case POST_FORMULARIO_TRASLADO_SUCCESS:
      return {
        ...state,
        loading: false,
        listaSalidaTraslados: action.payload,
      };
    case POST_FORMULARIO_TRASLADO_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default datosTrasladoRegistradoReducers;
