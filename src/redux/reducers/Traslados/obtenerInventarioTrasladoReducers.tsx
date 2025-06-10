
import { ListaTrasladoSeleccion } from '../../../components/Traslados/RegistrarTraslados';
import {
    OBTIENE_INV_TRASLADOS_REQUEST,
    OBTIENE_INV_TRASLADOS_SUCCESS,
    OBTIENE_INV_TRASLADOS_FAIL,
} from '../../actions/Traslados/types';


// Define el tipo para el estado inicial
interface obtenerInventarioState {
    loading: boolean;
    error: string | null;
    listaTrasladoSeleccion: ListaTrasladoSeleccion[];

}

// Estado inicial tipado
const initialState: obtenerInventarioState = {
    loading: false,
    error: null,
    listaTrasladoSeleccion: [],
};


// Reducer con tipos definidos
const obtenerInventarioTrasladoReducers = (state = initialState, action: any): obtenerInventarioState => {
    switch (action.type) {

        case OBTIENE_INV_TRASLADOS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case OBTIENE_INV_TRASLADOS_SUCCESS:
            return {
                ...state,
                loading: false,
                listaTrasladoSeleccion: action.payload,
            };
        case OBTIENE_INV_TRASLADOS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error || 'Error desconocido', // Mejor manejo de errores
            };
        default:
            return state;
    }
};

export default obtenerInventarioTrasladoReducers;
