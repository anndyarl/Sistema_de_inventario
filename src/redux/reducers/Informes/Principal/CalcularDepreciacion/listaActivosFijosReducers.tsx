// reducers/origenPresupuestoReducer.ts
import { ListaActivosFijos } from '../../../../../components/Informes/Principal/CalcularDepreciacion/CalcularDepreciacion';
import {
  LISTA_ACTIVOS_FIJOS_INFORME_REQUEST,
  LISTA_ACTIVOS_FIJOS_INFORME_SUCCESS,
  LISTA_ACTIVOS_FIJOS_INFORME_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaActivosFijos: ListaActivosFijos[];
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
