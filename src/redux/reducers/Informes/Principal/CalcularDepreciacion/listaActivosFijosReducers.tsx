// reducers/origenPresupuestoReducer.ts
import {
  LISTA_ACTIVOS_FIJOS_INFORME_REQUEST,
  LISTA_ACTIVOS_FIJOS_INFORME_SUCCESS,
  LISTA_ACTIVOS_FIJOS_INFORME_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaActivosFijos: Array<{
    aF_CLAVE: number;
    aF_CODIGO_GENERICO: string;
    aF_CODIGO_LARGO: string;
    deP_CORR: number;
    // esP_CODIGO: number;
    // aF_SECUENCIA: number;
    itE_CLAVE: number;
    aF_DESCRIPCION: string;
    aF_FINGRESO: string;
    // aF_ESTADO: string;
    aF_CODIGO: string;
    aF_TIPO: string;
    aF_ALTA: string;
    aF_PRECIO_REF: number;
    aF_CANTIDAD: number;
    aF_ORIGEN: number;
    aF_RESOLUCION: string;
    aF_FECHA_SOLICITUD: string;
    aF_OCO_NUMERO_REF: string;
    usuariO_CREA: string;
    f_CREA: string;
    iP_CREA: string;
    usuariO_MOD: string;
    f_MOD: string;
    // iP_MODt: string;
    aF_TIPO_DOC: number;
    proV_RUN: string;
    reG_EQM: string;
    aF_NUM_FAC: string;
    aF_FECHAFAC: string;
    aF_3UTM: string;
    iD_GRUPO: number;
    ctA_COD: string;
    transitoria: string;
    aF_MONTOFACTURA: number;
    esP_DESCOMPONE: string;
    aF_ETIQUETA: string;
    aF_VIDAUTIL: number;
    aF_VIGENTE: string;
    idprograma: number;
    idmodalidadcompra: number;
    idpropiedad: number;
    especie: string;
  }>;
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  listaActivosFijos: [],
  error: null,
};

const listaActivosFijosReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case LISTA_ACTIVOS_FIJOS_INFORME_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LISTA_ACTIVOS_FIJOS_INFORME_SUCCESS:
      return {
        ...state,
        loading: false,
        listaActivosFijos: action.payload
      };
    case LISTA_ACTIVOS_FIJOS_INFORME_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default listaActivosFijosReducers;
