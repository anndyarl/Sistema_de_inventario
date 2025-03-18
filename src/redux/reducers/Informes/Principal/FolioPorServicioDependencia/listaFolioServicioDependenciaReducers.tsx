// reducers/origenPresupuestoReducer.ts
import {
  LISTA_SERVICIO_DEPENDENCIA_REQUEST,
  LISTA_SERVICIO_DEPENDENCIA_SUCCESS,
  LISTA_SERVICIO_DEPENDENCIA_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaFolioServicioDependencia: Array<{
    servicio: string;
    dependencia: string;
    cuenta: string;
    especie: string;
    tipo: string;
    traS_ESTADO_AF: string;
    deP_CORR: number;
    deP_COD: string;
    seR_CORR: number;
    seR_COD: string;
    ctA_COD: string;
    altaS_CORR: number;
    aF_CANTIDAD: string;
    aF_RESOLUCION: string;
    aF_CODIGO_GENERICO: string;
    aF_FINGRESO: string;
    traS_CORR: number;
    aF_ESPECIE: string;
    aF_MARCA: string;
    aF_MODELO: string;
    aF_SERIE: string;
    aF_OBS: string;
    aF_FOLIO: string;
    ntraslado: number;
    deP_CORR_DESTINO: number;
    aF_CLAVE: number;
    valoR_LIBRO: number;
    vidA_UTIL: string;
    vutiL_RESTANTE: string;
    estabL_CORR: number;
  }>;
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  listaFolioServicioDependencia: [],
  error: null,
};

const listaFolioServicioDependenciaReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case LISTA_SERVICIO_DEPENDENCIA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LISTA_SERVICIO_DEPENDENCIA_SUCCESS:
      return {
        ...state,
        loading: false,
        listaFolioServicioDependencia: action.payload
      };
    case LISTA_SERVICIO_DEPENDENCIA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default listaFolioServicioDependenciaReducers;
