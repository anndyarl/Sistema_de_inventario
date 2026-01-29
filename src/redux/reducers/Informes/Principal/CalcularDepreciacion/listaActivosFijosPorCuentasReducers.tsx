// reducers/origenPresupuestoReducer.ts
import { ListaActivosFijos } from '../../../../../components/Informes/Principal/CalcularDepreciacion/CalcularDepreciacion';
import {
  LISTA_ACTIVOS_FIJOS_INFORME_POR_CUENTAS_REQUEST,
  LISTA_ACTIVOS_FIJOS_INFORME_POR_CUENTAS_SUCCESS,
  LISTA_ACTIVOS_FIJOS_INFORME_POR_CUENTAS_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaActivosPorCuentasFijos: ListaActivosFijos[];
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  listaActivosPorCuentasFijos: [],
  error: null,
};

const listaActivosFijosPorCuentasReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case LISTA_ACTIVOS_FIJOS_INFORME_POR_CUENTAS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LISTA_ACTIVOS_FIJOS_INFORME_POR_CUENTAS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaActivosPorCuentasFijos: action.payload
      };
    case LISTA_ACTIVOS_FIJOS_INFORME_POR_CUENTAS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
        listaActivosPorCuentasFijos: []
      };
    default:
      return state;
  }
};

export default listaActivosFijosPorCuentasReducers;
