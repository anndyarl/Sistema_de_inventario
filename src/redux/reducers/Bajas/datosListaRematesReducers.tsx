
import {
  OBTENER_REMATES_REQUEST,
  OBTENER_REMATES_SUCCESS,
  OBTENER_REMATES_FAIL
} from '../../actions/Bajas/types'

// Define el tipo para el estado inicial
interface DatosBajasState {
  listaRemates: Array<{
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
const initialState: DatosBajasState = {
  listaRemates: []
};

// Reducer con tipos definidos
const obtenerListaRematesReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case OBTENER_REMATES_REQUEST:
      return { ...state, loading: true };
    case OBTENER_REMATES_SUCCESS:
      return {
        ...state,
        loading: false,
        listaRemates: action.payload,
      };
    case OBTENER_REMATES_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default obtenerListaRematesReducers;
