
import { ListaSalidaTraspasos } from '../../../components/Traspasos/RegistrarTraspasos';
import {
  POST_FORMULARIO_TRASPASO_REQUEST,
  POST_FORMULARIO_TRASPASO_SUCCESS,
  POST_FORMULARIO_TRASPASO_FAIL
} from '../../actions/Traspasos/types';

// Define el tipo para el estado inicial
interface DatosInventarioState {
  listaSalidaTraspasos: ListaSalidaTraspasos[];
}// Estado inicial tipado
const initialState: DatosInventarioState = {
  listaSalidaTraspasos: []
};

// Reducer con tipos definidos
const datosTraspasoRegistradoReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case POST_FORMULARIO_TRASPASO_REQUEST:
      return { ...state, loading: true };
    case POST_FORMULARIO_TRASPASO_SUCCESS:
      return {
        ...state,
        loading: false,
        listaSalidaTraspasos: action.payload,
      };
    case POST_FORMULARIO_TRASPASO_FAIL:
      return {
        ...state, loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default datosTraspasoRegistradoReducers;
