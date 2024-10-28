
import { InventarioCompleto } from '../../../components/Inventario/ModificarInventario/ModificarInventario';
import {
  LISTA_INVENTARIO_REQUEST,
  LISTA_INVENTARIO_SUCCESS,
  LISTA_INVENTARIO_FAIL
} from '../../actions/types';


// Define el tipo para el estado inicial
interface DatosInventarioState {

  datosListaInventario: InventarioCompleto[];
}
// Estado inicial tipado
const initialState: DatosInventarioState = {

  datosListaInventario: []
};

// Reducer con tipos definidos
const datosListaInventarioReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_INVENTARIO_REQUEST:
      return { ...state, loading: true };
    case LISTA_INVENTARIO_SUCCESS:
      return {
        ...state,
        loading: false,
        datosListaInventario: action.payload,
      };
    case LISTA_INVENTARIO_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default datosListaInventarioReducer;
