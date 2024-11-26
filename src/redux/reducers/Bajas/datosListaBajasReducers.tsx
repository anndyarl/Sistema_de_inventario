
import {
  LISTA_BAJAS_REQUEST,
  LISTA_BAJAS_SUCCESS,
  LISTA_BAJAS_FAIL
} from '../../actions/Bajas/types'

// Define el tipo para el estado inicial
interface DatosInventarioState {
  listaBajas: Array<{
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
  listaBajas: []
};

// Reducer con tipos definidos
const datosListaBajasReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTA_BAJAS_REQUEST:
      return { ...state, loading: true };
    case LISTA_BAJAS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaBajas: action.payload,
      };
    case LISTA_BAJAS_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default datosListaBajasReducers;
