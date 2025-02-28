
import {
  LISTA_MANTENEDOR_PROVEEDORES_REQUEST,
  LISTA_MANTENEDOR_PROVEEDORES_SUCCESS,
  LISTA_MANTENEDOR_PROVEEDORES_FAIL
} from '../../../actions/Mantenedores/types'

// Define el tipo para el estado inicial
interface PropsState {
  listadoMantenedor: Array<{
    proV_CORR: number,
    proV_RUN: number,
    proV_DV: string,
    proV_NOMBRE: string,
    proV_FONO: string,
    proV_DIR: string
  }>;
}
// Estado inicial tipado
const initialState: PropsState = {
  listadoMantenedor: []
};

// Reducer con tipos definidos
const listadoMantenedorProveedoresReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_MANTENEDOR_PROVEEDORES_REQUEST:
      return { ...state, loading: true };
    case LISTA_MANTENEDOR_PROVEEDORES_SUCCESS:
      return {
        ...state,
        loading: false,
        listadoMantenedor: action.payload,
      };
    case LISTA_MANTENEDOR_PROVEEDORES_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default listadoMantenedorProveedoresReducers;
