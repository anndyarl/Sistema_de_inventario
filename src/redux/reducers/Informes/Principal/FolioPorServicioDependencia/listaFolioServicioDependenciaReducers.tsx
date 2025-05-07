// reducers/origenPresupuestoReducer.ts
import {
  LISTA_SERVICIO_DEPENDENCIA_REQUEST,
  LISTA_SERVICIO_DEPENDENCIA_SUCCESS,
  LISTA_SERVICIO_DEPENDENCIA_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaFolioServicioDependencia: Array<{
    //Principales
    aF_CLAVE: number;
    aF_CODIGO_GENERICO: string; //Nº inventario
    altaS_CORR: number;
    traS_CORR: number;
    estabL_CORR: number;

    //Listado
    deP_CORR: number; //Dependencia Origen
    servicio: string;
    dependencia: string;
    traS_ESTADO_AF: string;
    ctA_COD: string;
    aF_RESOLUCION: string;
    aF_FINGRESO: string;
    aF_ESPECIE: string; //Nombre especie
    aF_OBS: string;
    aF_FOLIO: string;
    ntraslado: number;
    valoR_LIBRO: number;

    //Props formulario;
    traS_MEMO_REF: string;
    seR_CORR: number;
    deP_CORR_DESTINO: number;
    traS_FECHA_MEMO: string;
    traS_NOM_ENTREGA: string,
    traS_NOM_RECIBE: string,
    traS_NOM_AUTORIZA: string
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
