// reducers/origenPresupuestoReducer.ts
import { ListaActivosFijos } from '../../../../../components/Informes/Principal/CalcularDepreciacion/CalcularDepreciacion';
import {
  LISTA_ACTIVOS_CALCULADOS_REQUEST,
  LISTA_ACTIVOS_CALCULADOS_SUCCESS,
  LISTA_ACTIVOS_CALCULADOS_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaActivosCalculados: ListaActivosFijos[];
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  listaActivosCalculados: [],
  error: null,
};

const listaActivosCalculadosReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case LISTA_ACTIVOS_CALCULADOS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LISTA_ACTIVOS_CALCULADOS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaActivosCalculados: action.payload
      };

    case LISTA_ACTIVOS_CALCULADOS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default listaActivosCalculadosReducers;
