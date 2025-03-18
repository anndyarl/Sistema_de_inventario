// reducers/origenPresupuestoReducer.ts
import {
  COMBO_SERVICIO_INFORME_REQUEST,
  COMBO_SERVICIO_INFORME_SUCCESS,
  COMBO_SERVICIO_INFORME_FAIL,

} from '../../../../actions/Informes/types';

interface PropsState {
  loading: boolean;
  comboServicioInforme: Array<{ deP_CORR: number; descripcion: string }>;
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  comboServicioInforme: [],
  error: null,
};

const comboServicioInformeReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case COMBO_SERVICIO_INFORME_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case COMBO_SERVICIO_INFORME_SUCCESS:
      return {
        ...state,
        loading: false,
        comboServicioInforme: action.payload
      };
    case COMBO_SERVICIO_INFORME_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboServicioInformeReducers;
