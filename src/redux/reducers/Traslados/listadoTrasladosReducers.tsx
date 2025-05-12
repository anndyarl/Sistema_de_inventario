
import { listadoTraslados } from '../../../components/Traslados/ListadoTraslados';
import {
    LISTA_TRASLADOS_REQUEST,
    LISTA_TRASLADOS_SUCCESS,
    LISTA_TRASLADOS_FAIL
} from '../../actions/Traslados/types'

// Define el tipo para el estado inicial
interface PropsState {
    listadoTraslados: listadoTraslados[];
}
// Estado inicial tipado
const initialState: PropsState = {
    listadoTraslados: []
};

// Reducer con tipos definidos
const listadoTrasladosReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case LISTA_TRASLADOS_REQUEST:
            return { ...state, loading: true };
        case LISTA_TRASLADOS_SUCCESS:
            return {
                ...state,
                loading: false,
                listadoTraslados: action.payload,
            };
        case LISTA_TRASLADOS_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};



export default listadoTrasladosReducers;
