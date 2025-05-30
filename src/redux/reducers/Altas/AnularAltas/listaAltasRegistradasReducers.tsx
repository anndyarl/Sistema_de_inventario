
import {
  OBTENER_ALTAS_REGISTRADAS_REQUEST,
  OBTENER_ALTAS_REGISTRADAS_SUCCESS,
  OBTENER_ALTAS_REGISTRADAS_FAIL
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosInventarioState {
  listaAltasRegistradas: Array<{
    aF_CLAVE: number,
    ninv: string,
    altaS_CORR: string,
    serv: string,
    dep: string,
    esp: string,
    ncuenta: string,
    marca: string,
    modelo: string,
    serie: string,
    estado: string,
    precio: string,
    fechA_ALTA: string,
    nrecep: string
  }>;
}
// Estado inicial tipado
const initialState: DatosInventarioState = {
  listaAltasRegistradas: []
};

// Reducer con tipos definidos
const listaAltasRegistradasReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case OBTENER_ALTAS_REGISTRADAS_REQUEST:
      return { ...state, loading: true };
    case OBTENER_ALTAS_REGISTRADAS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaAltasRegistradas: action.payload,
      };
    case OBTENER_ALTAS_REGISTRADAS_FAIL:
      return {
        ...state, loading: false,
        error: action.error,
        listaAltasRegistradas: []
      };
    default:
      return state;
  }
};



export default listaAltasRegistradasReducers;
