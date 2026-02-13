import { PropsTraspasos } from '../../../components/Traspasos/RegistrarTraspasos';
import {
    OBTIENE_INV_TRASPASOS_REQUEST,
    OBTIENE_INV_TRASPASOS_SUCCESS,
    OBTIENE_INV_TRASPASOS_FAIL,
} from '../../actions/Traspasos/types';


// Define el tipo para el estado inicial
interface obtenerInventarioState {
    loading: boolean;
    error: string | null;
    listaTrapasoSeleccion: PropsTraspasos[];

}

// Estado inicial tipado
const initialState: obtenerInventarioState = {
    loading: false,
    error: null,
    listaTrapasoSeleccion: [],
};


// Reducer con tipos definidos
const obtenerInventarioTraspasoReducers = (state = initialState, action: any): obtenerInventarioState => {
    switch (action.type) {

        case OBTIENE_INV_TRASPASOS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case OBTIENE_INV_TRASPASOS_SUCCESS:
            return {
                ...state,
                loading: false,
                listaTrapasoSeleccion: action.payload,
            };
        case OBTIENE_INV_TRASPASOS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error || 'Error desconocido', // Mejor manejo de errores
            };
        default:
            return state;
    }
};

export default obtenerInventarioTraspasoReducers;
