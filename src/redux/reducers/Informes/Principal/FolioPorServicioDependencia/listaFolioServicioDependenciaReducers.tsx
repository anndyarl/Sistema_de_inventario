// reducers/origenPresupuestoReducer.ts
import { ListaFolioServicioDependencia } from '../../../../../components/Informes/Principal/FolioPorServicioDependencia/FolioPorServicioDependencia';
import {
  LISTA_SERVICIO_DEPENDENCIA_REQUEST,
  LISTA_SERVICIO_DEPENDENCIA_SUCCESS,
  LISTA_SERVICIO_DEPENDENCIA_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  listaFolioServicioDependencia: ListaFolioServicioDependencia[];
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
