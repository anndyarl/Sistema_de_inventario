// reducers/origenPresupuestoReducer.ts
import {
    COMBO_CUENTA_INFORME_REQUEST,
    COMBO_CUENTA_INFORME_SUCCESS,
    COMBO_CUENTA_INFORME_FAIL,

} from '../../../actions/Informes/types';

interface PropsState {
    loading: boolean;
    comboCuentasInforme: Array<{ codigo: string; descripcion: string }>;
    error: string | null;
}

const initialState: PropsState = {
    loading: false,
    comboCuentasInforme: [],
    error: null,
};

const comboCuentasInformeReducers = (state = initialState, action: any): PropsState => {
    switch (action.type) {
        case COMBO_CUENTA_INFORME_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case COMBO_CUENTA_INFORME_SUCCESS:
            return {
                ...state,
                loading: false,
                comboCuentasInforme: action.payload
            };
        case COMBO_CUENTA_INFORME_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        default:
            return state;
    }
};

export default comboCuentasInformeReducers;
