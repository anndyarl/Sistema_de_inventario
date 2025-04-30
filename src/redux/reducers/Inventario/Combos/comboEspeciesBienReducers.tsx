// reducers/origenPresupuestoReducer.ts
import {
    COMBO_ESPECIES_BIEN_REQUEST,
    COMBO_ESPECIES_BIEN_SUCCESS,
    COMBO_ESPECIES_BIEN_FAIL,

} from '../../../actions/Inventario/types';

interface ListadoDeEspeciesBienState {
    loading: boolean;
    comboEspecies: Array<{ estabL_CORR: number; esP_CODIGO: string; nombrE_ESP: string }>;
    error: string | null;
}

const initialState: ListadoDeEspeciesBienState = {
    loading: false,
    comboEspecies: [],
    error: null,
};

const comboEspeciesBienReducers = (state = initialState, action: any): ListadoDeEspeciesBienState => {
    switch (action.type) {
        case COMBO_ESPECIES_BIEN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case COMBO_ESPECIES_BIEN_SUCCESS:
            return {
                ...state,
                loading: false,
                comboEspecies: action.payload
            };
        case COMBO_ESPECIES_BIEN_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        default:
            return state;
    }
};

export default comboEspeciesBienReducers;