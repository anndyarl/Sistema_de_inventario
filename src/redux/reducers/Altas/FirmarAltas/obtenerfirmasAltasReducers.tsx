
import { DatosFirmas } from '../../../../components/Altas/FirmarAltas/FirmarAltas';
import {
    OBTENER_FIRMAS_ALTAS_REQUEST,
    OBTENER_FIRMAS_ALTAS_SUCCESS,
    OBTENER_FIRMAS_ALTAS_FAIL,
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosState {
    datosFirmas: DatosFirmas[];
}

// Estado inicial tipado
const initialState: DatosState = {
    datosFirmas: []
};

// Reducer con tipos definidos
const obtenerfirmasAltasReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case OBTENER_FIRMAS_ALTAS_REQUEST:
            return { ...state, loading: true };
        case OBTENER_FIRMAS_ALTAS_SUCCESS:
            return {
                ...state,
                loading: false,
                datosFirmas: action.payload,
            };
        case OBTENER_FIRMAS_ALTAS_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default obtenerfirmasAltasReducers;