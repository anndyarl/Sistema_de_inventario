
import { listadoTraslados } from '../../../components/Traslados/ListadoTraslados';
import {
    LISTA_TRASLADOS_ADJUNTOS_REQUEST,
    LISTA_TRASLADOS_ADJUNTOS_SUCCESS,
    LISTA_TRASLADOS_ADJUNTOS_FAIL
} from '../../actions/Traslados/types'

// Define el tipo para el estado inicial
interface PropsState {
    listadoTrasladosAdjuntos: listadoTraslados[];
}
// Estado inicial tipado
const initialState: PropsState = {
    listadoTrasladosAdjuntos: []
};

// Reducer con tipos definidos
const listadoTrasladosAdjuntosReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case LISTA_TRASLADOS_ADJUNTOS_REQUEST:
            return { ...state, loading: true };
        case LISTA_TRASLADOS_ADJUNTOS_SUCCESS:
            return {
                ...state,
                loading: false,
                listadoTrasladosAdjuntos: action.payload,
            };
        case LISTA_TRASLADOS_ADJUNTOS_FAIL:
            return {
                ...state, loading: false,
                error: action.error,
                listadoTraspasosAdjuntos: []
            };
        default:
            return state;
    }
};



export default listadoTrasladosAdjuntosReducers;
