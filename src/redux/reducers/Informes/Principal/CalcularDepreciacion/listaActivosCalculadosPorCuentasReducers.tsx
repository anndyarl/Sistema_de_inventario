// reducers/origenPresupuestoReducer.ts
import { ListaActivosFijos } from '../../../../../components/Informes/Principal/CalcularDepreciacion/CalcularDepreciacion';
import {
  LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_REQUEST,
  LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_SUCCESS,
  LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaActivosCalculadosPorCuentas: ListaActivosFijos[];
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  listaActivosCalculadosPorCuentas: [],
  error: null,
};

const listaActivosCalculadosPorCuentasReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaActivosCalculadosPorCuentas: action.payload
      };

    case LISTA_ACTIVOS_CALCULADOS_POR_CUENTAS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default listaActivosCalculadosPorCuentasReducers;
