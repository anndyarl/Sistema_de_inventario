
import { ListaEstadoFirmas } from '../../../../components/Altas/EstadoFirmas/EstadoFirmas ';
import {
    LISTA_ESTADO_REQUEST,
    LISTA_ESTADO_SUCCESS,
    LISTA_ESTADO_FAIL,
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosState {
    listaEstado: ListaEstadoFirmas[];
}
// Estado inicial tipado
const initialState: DatosState = {
    listaEstado: []
};

// Reducer con tipos definidos
const listaEstadoReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case LISTA_ESTADO_REQUEST:
            return { ...state, loading: true };
        case LISTA_ESTADO_SUCCESS:
            return {
                ...state,
                loading: false,
                listaEstado: action.payload,
            };
        case LISTA_ESTADO_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default listaEstadoReducers;