// reducers/origenPresupuestoReducer.ts
import {
    LISTADO_ESPECIES_BIEN_REQUEST,
    LISTADO_ESPECIES_BIEN_SUCCESS,
    LISTADO_ESPECIES_BIEN_FAIL,

} from '../../../actions/Inventario/types';

interface ListadoDeEspeciesBienState {
    loading: boolean;
    listadoDeEspecies: Array<{ estabL_CORR: number; esP_CODIGO: string; nombrE_ESP: string }>;
    error: string | null;
}

const initialState: ListadoDeEspeciesBienState = {
    loading: false,
    listadoDeEspecies: [],
    error: null,
};

const listadoDeEspeciesBienReducers = (state = initialState, action: any): ListadoDeEspeciesBienState => {
    switch (action.type) {
        case LISTADO_ESPECIES_BIEN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case LISTADO_ESPECIES_BIEN_SUCCESS:
            return {
                ...state,
                loading: false,
                listadoDeEspecies: action.payload
            };
        case LISTADO_ESPECIES_BIEN_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        default:
            return state;
    }
};

export default listadoDeEspeciesBienReducers;