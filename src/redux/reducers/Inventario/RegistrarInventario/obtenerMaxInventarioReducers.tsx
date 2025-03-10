
import {
    OBTENER_MAX_INVENTARIO_REQUEST,
    OBTENER_MAX_INVENTARIO_SUCCESS,
    OBTENER_MAX_INVENTARIO_FAIL
} from '../../../actions/Inventario/types'

// Define el tipo para el estado inicial
interface PropsState {
    loading: boolean;
    AF_CODIGO_GENERICO: number;
    error: string | null;
}
// Estado inicial tipado
const initialState: PropsState = {
    loading: false,
    AF_CODIGO_GENERICO: 0,
    error: null,
};

// Reducer con tipos definidos
const obtenerMaxInventarioReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case OBTENER_MAX_INVENTARIO_REQUEST:
            return { ...state, loading: true };
        case OBTENER_MAX_INVENTARIO_SUCCESS:
            return {
                ...state,
                loading: false,
                AF_CODIGO_GENERICO: action.payload,
            };
        case OBTENER_MAX_INVENTARIO_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default obtenerMaxInventarioReducers;
