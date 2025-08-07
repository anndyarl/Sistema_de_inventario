
import { listaAltas } from '../../../../components/Inventario/ModificarInventario';
import {
    OBTENER_INVENTARIO_X_ALTAS_REQUEST,
    OBTENER_INVENTARIO_X_ALTAS_SUCCESS,
    OBTENER_INVENTARIO_X_ALTAS_FAIL,
} from '../../../actions/Inventario/types';


// Define el tipo para el estado inicial
interface obtenerInventarioState {
    loading: boolean;
    error: string | null;
    listaAltas: listaAltas[];
}

// Estado inicial tipado
const initialState: obtenerInventarioState = {
    loading: false,
    error: null,
    listaAltas: []
};


// Reducer con tipos definidos
const obtenerInventarioXAltasReducers = (state = initialState, action: any): obtenerInventarioState => {
    switch (action.type) {

        case OBTENER_INVENTARIO_X_ALTAS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case OBTENER_INVENTARIO_X_ALTAS_SUCCESS:
            return {
                ...state,
                loading: false,
                listaAltas: action.payload,
            };
        case OBTENER_INVENTARIO_X_ALTAS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error || 'Error desconocido', // Mejor manejo de errores
            };
        default:
            return state;
    }
};



export default obtenerInventarioXAltasReducers;
