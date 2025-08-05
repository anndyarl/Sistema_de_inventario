
import { SERVICIO_DEPENDENCIA } from '../../../../components/Inventario/ModificarInventario';
import {
  COMBO_SER_DEP_MODIFICAR_REQUEST,
  COMBO_SER_DEP_MODIFICAR_SUCCESS,
  COMBO_SER_DEP_MODIFICAR_FAIL,

} from '../../../actions/Inventario/types'

interface PropsState {
  loading: boolean;
  comboSerDep: SERVICIO_DEPENDENCIA[];
  error: string | null;
}

const initialState: PropsState = {
  loading: false,
  comboSerDep: [],
  error: null,
};

const comboServDepReducers = (state = initialState, action: any): PropsState => {
  switch (action.type) {
    case COMBO_SER_DEP_MODIFICAR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case COMBO_SER_DEP_MODIFICAR_SUCCESS:
      return {
        ...state,
        loading: false,
        comboSerDep: action.payload
      };
    case COMBO_SER_DEP_MODIFICAR_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default comboServDepReducers;
