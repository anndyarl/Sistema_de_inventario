
import { ListaEstadoFirmas } from '../../../../components/Altas/FirmarAltas/FirmarAltas';
import {
    LISTA_ESTADO_FIRMAS_REQUEST,
    LISTA_ESTADO_FIRMAS_SUCCESS,
    LISTA_ESTADO_FIRMAS_FAIL,
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosState {
    listaEstadoFirmas: ListaEstadoFirmas[];
}
// Estado inicial tipado
const initialState: DatosState = {
    listaEstadoFirmas: []
};

// Reducer con tipos definidos
const listaEstadoFirmasReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case LISTA_ESTADO_FIRMAS_REQUEST:
            return { ...state, loading: true };
        case LISTA_ESTADO_FIRMAS_SUCCESS:
            return {
                ...state,
                loading: false,
                listaEstadoFirmas: action.payload,
            };
        case LISTA_ESTADO_FIRMAS_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default listaEstadoFirmasReducers;