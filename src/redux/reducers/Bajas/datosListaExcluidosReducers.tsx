
import {
  OBTENER_EXCLUIDOS_REQUEST,
  OBTENER_EXCLUIDOS_SUCCESS,
  OBTENER_EXCLUIDOS_FAIL
} from '../../actions/Bajas/types'

// Define el tipo para el estado inicial
interface DatosBajasState {
  listaExcluidos: Array<{
    nresolucion: string;
    observaciones: string;
    useR_MOD: number;
    bajaS_CORR: number;
    aF_CLAVE: string;
    fechA_BAJA: string;
    especie: string;
    ncuenta: string;
    vutiL_AGNOS: number;
    vutiL_RESTANTE: number;
    deP_ACUMULADA: number;
    iniciaL_VALOR: number;
    saldO_VALOR: number;
    estado: number;
    // aF_CLAVE: string;
    // bajaS_CORR: string;
    // especie: string;
    // vutiL_RESTANTE: number;
    // vutiL_AGNOS: number;
    // nresolucion: string;
    // observaciones: string;
    // deP_ACUMULADA: number;
    // ncuenta: string;
    // estado: number;
    // fechA_REMATES: string;
    // reM_CORR: string;
    // boD_CORR: string;
  }>;
}
// Estado inicial tipado
const initialState: DatosBajasState = {
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
      return {
        ...state, loading: false,
        error: action.error,
        listaExcluidos: []
      };
    default:
      return state;
  }
};



export default obtenerListaExcluidosReducers;
