
import { InventarioCompleto } from '../../../../components/Inventario/ModificarInventario';
import {
  LISTA_INVENTARIO_ANULAR_REQUEST,
  LISTA_INVENTARIO_ANULAR_SUCCESS,
  LISTA_INVENTARIO_ANULAR_FAIL
} from '../../../actions/Inventario/types';


// Define el tipo para el estado inicial
interface DatosInventarioState {
  listaInventarioAnular: InventarioCompleto[];
}
// Estado inicial tipado
const initialState: DatosInventarioState = {
  listaInventarioAnular: []
};

// Reducer con tipos definidos
const listaInventarioAnularReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_INVENTARIO_ANULAR_REQUEST:
      return { ...state, loading: true };
    case LISTA_INVENTARIO_ANULAR_SUCCESS:
      return {
        ...state,
        loading: false,
        listaInventarioAnular: action.payload,
      };
    case LISTA_INVENTARIO_ANULAR_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default listaInventarioAnularReducers;
