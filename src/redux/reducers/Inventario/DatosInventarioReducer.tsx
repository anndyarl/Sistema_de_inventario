
import { InventarioCompleto } from '../../../components/Inventario/RegistrarInventario/Datos_inventario';
import {
  INVENTARIO_REQUEST,
  INVENTARIO_SUCCESS,
  INVENTARIO_FAIL
} from '../../actions/types';


// Define el tipo para el estado inicial
interface DatosInventarioState {

  datosInventarioCompleto: InventarioCompleto[];
}
// Estado inicial tipado
const initialState: DatosInventarioState = {

  datosInventarioCompleto: []
};

// Reducer con tipos definidos
const datosInventarioReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case INVENTARIO_REQUEST:
      return { ...state, loading: true };
    case INVENTARIO_SUCCESS:
      return {
        ...state,
        loading: false,
        datosInventarioCompleto: [...state.datosInventarioCompleto, ...action.payload],
      };
    case INVENTARIO_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default datosInventarioReducer;
