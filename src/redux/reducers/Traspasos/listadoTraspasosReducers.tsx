
import { listadoTraslados } from '../../../components/Traslados/ListadoTraslados';
import {
    LISTA_TRASPASOS_REQUEST,
    LISTA_TRASPASOS_SUCCESS,
    LISTA_TRASPASOS_FAIL
} from '../../actions/Traspasos/types'

// Define el tipo para el estado inicial
interface PropsState {
    listadoTraspasos: listadoTraslados[];
}
// Estado inicial tipado
const initialState: PropsState = {
    listadoTraspasos: []
};

// Reducer con tipos definidos
const listadoTraspasosReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case LISTA_TRASPASOS_REQUEST:
            return { ...state, loading: true };
        case LISTA_TRASPASOS_SUCCESS:
            return {
                ...state,
                loading: false,
                listadoTraspasos: action.payload,
            };
        case LISTA_TRASPASOS_FAIL:
            return {
                ...state, loading: false,
                error: action.error,
                listadoTraspasos: []
            };
        default:
            return state;
    }
};



export default listadoTraspasosReducers;
