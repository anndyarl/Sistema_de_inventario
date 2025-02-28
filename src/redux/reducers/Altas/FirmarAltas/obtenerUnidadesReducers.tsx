
import {
    OBTENER_UNIDADES_REQUEST,
    OBTENER_UNIDADES_SUCCESS,
    OBTENER_UNIDADES_FAIL,
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosState {
    comboUnidades: Array<{
        iD_UNIDAD: number,
        nombre: string
    }>;
}

// Estado inicial tipado
const initialState: DatosState = {
    comboUnidades: []
};

// Reducer con tipos definidos
const obtenerUnidadesReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case OBTENER_UNIDADES_REQUEST:
            return { ...state, loading: true };
        case OBTENER_UNIDADES_SUCCESS:
            return {
                ...state,
                loading: false,
                comboUnidades: action.payload,
            };
        case OBTENER_UNIDADES_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default obtenerUnidadesReducers;
