
import { ListaEstadoFirmas } from '../../../../components/Altas/EstadoFirmas/EstadoFirmas ';
import {
    OBTIENE_VISADO_COMPLETO_REQUEST,
    OBTIENE_VISADO_COMPLETO_SUCCESS,
    OBTIENE_VISADO_COMPLETO_FAIL,
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosState {
    documentoByte64: string
}

// Estado inicial tipado
const initialState: DatosState = {
    documentoByte64: ""
};

// Reducer con tipos definidos
const obtieneVisadoCompletoReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case OBTIENE_VISADO_COMPLETO_REQUEST:
            return { ...state, loading: true };
        case OBTIENE_VISADO_COMPLETO_SUCCESS:
            return {
                ...state,
                loading: false,
                documentoByte64: action.payload,
            };
        case OBTIENE_VISADO_COMPLETO_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default obtieneVisadoCompletoReducers;