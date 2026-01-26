
import {
    VISADO_ALTAS_REQUEST,
    VISADO_ALTAS_SUCCESS,
    VISADO_ALTAS_FAIL,
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosState {
    idocumentoAlta: number;
}

// Estado inicial tipado
const initialState: DatosState = {
    idocumentoAlta: 0
};

// Reducer con tipos definidos
const registrarDocumentoAltasReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case VISADO_ALTAS_REQUEST:
            return { ...state, loading: true };
        case VISADO_ALTAS_SUCCESS:
            return {
                ...state,
                loading: false,
                idocumentoAlta: action.payload,
            };
        case VISADO_ALTAS_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default registrarDocumentoAltasReducers;
