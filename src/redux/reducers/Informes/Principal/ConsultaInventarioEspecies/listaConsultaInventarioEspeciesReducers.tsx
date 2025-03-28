// reducers/origenPresupuestoReducer.ts
import {
  LISTA_CONSULTA_INVENTARIO_ESPECIES_REQUEST,
  LISTA_CONSULTA_INVENTARIO_ESPECIES_SUCCESS,
  LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaConsultaInventarioEspecie: Array<{
    aF_CLAVE: number;
    traS_CORR: number;
    id: number;
    aF_CODIGO_GENERICO: string;
    fecha: string;
    aF_TIPO: string;
    dependencia: string;
    servicio: string;
    valor: number;
    especie: string;
    deT_MARCA: string;
    deT_MODELO: string;
    deT_SERIE: string;
    deT_OBS: string;
    altaS_CORR: number;
    aF_RESOLUCION: string;
    ctA_COD: string;
    vida: number;
    establecmiento: number;
    proV_RUN: number
    proV_NOMBRE: string;
  }>;
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  listaConsultaInventarioEspecie: [],
  error: null,
};

const listaConsultaInventarioEspeciesReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case LISTA_CONSULTA_INVENTARIO_ESPECIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LISTA_CONSULTA_INVENTARIO_ESPECIES_SUCCESS:
      return {
        ...state,
        loading: false,
        listaConsultaInventarioEspecie: action.payload
      };
    case LISTA_CONSULTA_INVENTARIO_ESPECIES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default listaConsultaInventarioEspeciesReducers;
