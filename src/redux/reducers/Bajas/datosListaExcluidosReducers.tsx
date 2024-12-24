
import {
  OBTENER_EXCLUIDOS_REQUEST,
  OBTENER_EXCLUIDOS_SUCCESS,
  OBTENER_EXCLUIDOS_FAIL
} from '../../actions/Bajas/types'

// Define el tipo para el estado inicial
interface DatosInventarioState {
  listaExcluidos: Array<{
    aF_CLAVE: string;
    bajaS_CORR: string;
    especie: string;
    vutiL_RESTANTE: number;
    vutiL_AGNOS: number;
    nresolucion: string;
    observaciones: string;
    deP_ACUMULADA: number;
    ncuenta: string;
    estado: number;
    fechA_REMATES: string;
    reM_CORR: string;
    boD_CORR: string;
  }>;
}
// Estado inicial tipado
const initialState: DatosInventarioState = {
  listaExcluidos: []
};

// Reducer con tipos definidos
const obtenerListaExcluidosReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case OBTENER_EXCLUIDOS_REQUEST:
      return { ...state, loading: true };
    case OBTENER_EXCLUIDOS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaExcluidos: action.payload,
      };
    case OBTENER_EXCLUIDOS_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default obtenerListaExcluidosReducers;
