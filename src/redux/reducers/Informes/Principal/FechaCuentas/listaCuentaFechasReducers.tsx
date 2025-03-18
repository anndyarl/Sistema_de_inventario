// reducers/origenPresupuestoReducer.ts
import {
  LISTA_CUENTA_FECHAS_REQUEST,
  LISTA_CUENTA_FECHAS_SUCCESS,
  LISTA_CUENTA_FECHAS_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaCuentaFechas: Array<{
    codinventario: string;
    codcuenta: string;
    cuenta: string;
    nuM_ALTA: number;
    codespecie: string;
    especie: string;
    fechaingreso: string;
    valorinicial: number;
    vidA_UTIL: number;
    depreciacion: number;
    depreciacionacumulada: number;
    deteriorO_DEBE: number;
    deteriorO_HABER: number;
    valorlibro: number;
    estabL_CORR: number;
    establecimiento: string;
    propietario: number;
    destino: string;
    nuM_OCO: string;
    nuM_FAC: string;
    proveedor: string;
    serie: string;
    marca: string;
  }>;
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  listaCuentaFechas: [],
  error: null,
};

const listaCuentaFechasReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case LISTA_CUENTA_FECHAS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LISTA_CUENTA_FECHAS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaCuentaFechas: action.payload
      };
    case LISTA_CUENTA_FECHAS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default listaCuentaFechasReducers;
