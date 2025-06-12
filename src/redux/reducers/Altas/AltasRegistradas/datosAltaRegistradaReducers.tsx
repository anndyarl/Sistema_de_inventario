
import { ListaSalidaAltas } from '../../../../components/Altas/RegistrarAltas';
import {
  REGISTRAR_ALTAS_REQUEST,
  REGISTRAR_ALTAS_SUCCESS,
  REGISTRAR_ALTAS_FAIL
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosInventarioState {
  listaSalidaAltas: ListaSalidaAltas[];
}// Estado inicial tipado
const initialState: DatosInventarioState = {
  listaSalidaAltas: []
};

// Reducer con tipos definidos
const datosAltaRegistradaReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case REGISTRAR_ALTAS_REQUEST:
      return { ...state, loading: true };
    case REGISTRAR_ALTAS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaSalidaAltas: action.payload,
      };
    case REGISTRAR_ALTAS_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default datosAltaRegistradaReducers;
