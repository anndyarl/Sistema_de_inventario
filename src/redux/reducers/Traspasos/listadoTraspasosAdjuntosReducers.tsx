
import { listadoTraslados } from '../../../components/Traslados/ListadoTraslados';
import {
    LISTA_TRASPASOS_ADJUNTOS_REQUEST,
    LISTA_TRASPASOS_ADJUNTOS_SUCCESS,
    LISTA_TRASPASOS_ADJUNTOS_FAIL
} from '../../actions/Traspasos/types'

// Define el tipo para el estado inicial
interface PropsState {
    listadoTraspasosAdjuntos: listadoTraslados[];
}
// Estado inicial tipado
const initialState: PropsState = {
    listadoTraspasosAdjuntos: []
};

// Reducer con tipos definidos
const listadoTraspasosAdjuntosReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case LISTA_TRASPASOS_ADJUNTOS_REQUEST:
            return { ...state, loading: true };
        case LISTA_TRASPASOS_ADJUNTOS_SUCCESS:
            return {
                ...state,
                loading: false,
                listadoTraspasosAdjuntos: action.payload,
            };
        case LISTA_TRASPASOS_ADJUNTOS_FAIL:
            return {
                ...state, loading: false,
                error: action.error,
                listadoTraspasosAdjuntos: []
            };
        default:
            return state;
    }
};



export default listadoTraspasosAdjuntosReducers;
