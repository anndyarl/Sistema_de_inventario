
import {
  LISTADO_GENERAL_BAJAS_REQUEST,
  LISTADO_GENERAL_BAJAS_SUCCESS,
  LISTADO_GENERAL_BAJAS_FAIL
} from '../../actions/Bajas/types'

// Define el tipo para el estado inicial
interface DatosBajasState {
  listadoGeneralBajas: Array<{
    aF_CLAVE: number;
    aF_CODIGO_GENERICO: string;
    aF_CODIGO_LARGO: string;
    deP_CORR: number;
    esP_CODIGO: string;
    aF_SECUENCIA: number;
    itE_CLAVE: number;
    aF_DESCRIPCION: string;
    aF_FINGRESO: Date;
    aF_ESTADO: string;
    aF_CODIGO: string;
    aF_TIPO: string;
    aF_ALTA: string;
    aF_PRECIO_REF: number;
    aF_CANTIDAD: number;
    aF_ORIGEN: number;
    aF_RESOLUCION: string;
    aF_FECHA_SOLICITUD: Date;
    aF_OCO_NUMERO_REF: string;
    usuariO_CREA: string;
    f_CREA: Date;
    iP_CREA: string;
    usuariO_MOD: string;
    f_MOD: Date;
    iP_MOD: string;
    aF_TIPO_DOC: string;
    prov_RUN: number;
    reG_EQM: string;
    aF_NUM_FAC: string;
    aF_FECHAFAC: Date;
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
    aF_ESTADO_INV: number;
  }>;
}
// Estado inicial tipado
const initialState: DatosBajasState = {
  listadoGeneralBajas: []
};

// Reducer con tipos definidos
const datosListadoGeneralBajasReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LISTADO_GENERAL_BAJAS_REQUEST:
      return { ...state, loading: true };
    case LISTADO_GENERAL_BAJAS_SUCCESS:
      return {
        ...state,
        loading: false,
        listadoGeneralBajas: action.payload,
      };
    case LISTADO_GENERAL_BAJAS_FAIL:
      return {
        ...state, loading: false,
        error: action.error,
        listadoGeneralBajas: []
      };
    default:
      return state;
  }
};



export default datosListadoGeneralBajasReducers;
