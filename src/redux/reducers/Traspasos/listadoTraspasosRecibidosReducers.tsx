
import { listadoTraslados } from '../../../components/Traslados/ListadoTraslados';
import {
    LISTA_TRASPASOS_RECIBIDOS_REQUEST,
    LISTA_TRASPASOS_RECIBIDOS_SUCCESS,
    LISTA_TRASPASOS_RECIBIDOS_FAIL
} from '../../actions/Traspasos/types'

// Define el tipo para el estado inicial
interface PropsState {
    listadoTraspasosRecibidos: listadoTraslados[];
}
// Estado inicial tipado
const initialState: PropsState = {
    listadoTraspasosRecibidos: []
};

// Reducer con tipos definidos
const listadoTraspasosRecibidosReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case LISTA_TRASPASOS_RECIBIDOS_REQUEST:
            return { ...state, loading: true };
        case LISTA_TRASPASOS_RECIBIDOS_SUCCESS:
            return {
                ...state,
                loading: false,
                listadoTraspasosRecibidos: action.payload,
            };
        case LISTA_TRASPASOS_RECIBIDOS_FAIL:
            return {
                ...state, loading: false,
                error: action.error,
                listadoTraspasosRecibidos: []
            };
        default:
            return state;
    }
};



export default listadoTraspasosRecibidosReducers;
