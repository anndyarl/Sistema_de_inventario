
import { InventarioCompleto } from '../../../../components/Inventario/ModificarInventario';
import {
  LISTA_INVENTARIO_BUSCAR_REQUEST,
  LISTA_INVENTARIO_BUSCAR_SUCCESS,
  LISTA_INVENTARIO_BUSCAR_FAIL
} from '../../../actions/Inventario/types';


// Define el tipo para el estado inicial
interface DatosInventarioState {
  listaInventarioBuscar: InventarioCompleto[];
}
// Estado inicial tipado
const initialState: DatosInventarioState = {
  listaInventarioBuscar: []
};

// Reducer con tipos definidos
const listaInventarioBuscarReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_INVENTARIO_BUSCAR_REQUEST:
      return { ...state, loading: true };
    case LISTA_INVENTARIO_BUSCAR_SUCCESS:
      return {
        ...state,
        loading: false,
        listaInventarioBuscar: action.payload,
      };
    case LISTA_INVENTARIO_BUSCAR_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default listaInventarioBuscarReducers;
