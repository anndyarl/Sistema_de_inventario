import { ListaActivosFijos } from '../../../../../components/Informes/Principal/CalcularDepreciacion/CalcularDepreciacion';
import {
  LISTA_ACTIVOS_NO_CALCULADOS_REQUEST,
  LISTA_ACTIVOS_NO_CALCULADOS_SUCCESS,
  LISTA_ACTIVOS_NO_CALCULADOS_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaActivosNoCalculados: ListaActivosFijos[];
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  listaActivosNoCalculados: [],
  error: null,
};

const listaActivosNoCalculadosReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case LISTA_ACTIVOS_NO_CALCULADOS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LISTA_ACTIVOS_NO_CALCULADOS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaActivosNoCalculados: action.payload
      };

    case LISTA_ACTIVOS_NO_CALCULADOS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default listaActivosNoCalculadosReducers;
