
import {
  LISTA_ALTAS_REQUEST,
  LISTA_ALTAS_SUCCESS,
  LISTA_ALTAS_FAIL
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosInventarioState {
  ListaAltas: Array<{
    aF_CLAVE: number,
    ninv: string,
    serv: string,
    dep: string,
    esp: string,
    ncuenta: string,
    marca: string,
    modelo: string,
    serie: string,
    precio: string,
    mrecepcion: string
  }>;
}
// Estado inicial tipado
const initialState: DatosInventarioState = {
  ListaAltas: []
};

// Reducer con tipos definidos
const datosListaAltasReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_ALTAS_REQUEST:
      return { ...state, loading: true };
    case LISTA_ALTAS_SUCCESS:
      return {
        ...state,
        loading: false,
        ListaAltas: action.payload,
      };
    case LISTA_ALTAS_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default datosListaAltasReducers;
